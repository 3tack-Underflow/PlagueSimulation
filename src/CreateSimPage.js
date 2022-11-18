import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

import AssistantEntry from "./AssistantEntry.js";
import { useCookies } from 'react-cookie';
import { names, stageWidth, stageHeight } from "./Constants.js"

function CreatePage() {
    var randomDisease = ['Insanity Death', 'Lunacy Plague', 
        'The Ruthless Infestation', 'Crazed Pandemic', 'The Neglected Scourge',
        'The Onyx Death', 'The Inferior Plague', 'Lingering Death', 
        'le Fléau d\'nsanité', 'l\'Éclosion de Chaos',
        'The Second Affliction', 'The White Plague', 'The Dawn Affliction',
        'The Radical Pandemic', 'Phantom Rage', 'Mad Epidemic',
        'The Curtains Outbreak', 'Zombie Outbreak', 'Fury Pandemic',
        'The Apex Contagion', 'Saltwater Scourage', 'The Unseen Contagion',
        'The Great Contagion', 'COVID part II', 'COVID part III',
        'The Dusk Outbreak', 'The Radical Death', 'Vampire Plague',
        'Disco Fever', 'Stupidity', 'ZA WARUDO'];

    // 👇️ get number between min (inclusive) and max (inclusive)
    function randomNumberInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const [bacteriumName, setBacteriumName] = 
        useState(randomDisease[randomNumberInRange(0, randomDisease.length - 1)]);
    const [severity, setSeverity] = useState('Random');
    const [origin, setOrigin] = useState('Random');
    const [assistantName, setAssistantName] = useState('');
    const [assistants, setAssistants] = useState([]);
    const [nextAssistant, setNextAssistant] = useState(0);

    const [simID, setSimID] = useState(0);
    const [totalPopulation, setTotalPopulation] = useState(0);
    const [cookies, setCookie] = useCookies(['name']);

    const InsertSim = () => {
        var origin_rating;
        if (origin === 'Random') origin_rating = Math.floor(Math.random() * 3) + 1;
        else if (origin === 'Outskirt') origin_rating = 1;
        else if (origin === 'City') origin_rating = 2;
        else origin_rating = 3;
        
        if (origin_rating === 1) {
            setTotalPopulation(45 + Math.floor(Math.random() * 31));
        } else if (origin_rating === 2) {
            setTotalPopulation(125 + Math.floor(Math.random() * 51));
        } else {
            setTotalPopulation(250 + Math.floor(Math.random() * 101));
        }
        
        Axios.post('http://localhost:3001/api/insert-sim', {
            disease_name: bacteriumName,
            creation_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
            completion_time: null, 
            last_modified_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
            starting_population: totalPopulation, 
            isolation_capacity: 10, 
            sim_status: "Ongoing",
            num_deceased: 0, 
            seed: "abcd", 
            funds: 1000
        }).then((response) => {
            setSimID(response.data[1][0]['LAST_INSERT_ID()']);
        })
    }

    const InsertPlague = async () =>  {
        var severity_rating, spread_r, spread_c, mutation_c, curing_t, fatality_t, death_r, death_c, numRules, numInfest;
        if (severity === 'Random') severity_rating = Math.floor(Math.random() * 3) + 1;
        else if (severity === 'Average') severity_rating = 1;
        else if (severity === 'Strong') severity_rating = 2;
        else severity_rating = 3;
        if (severity_rating === 1) {
            spread_r = 10 + Math.floor(Math.random() * 5); // km
            spread_c = Math.floor(1 + Math.random() * 1); // percentage chance for an individual to be infected after an update
            mutation_c = 60 * 6 + Math.floor(Math.random() * (60 * 7)) // time (minutes) * delta_time
            curing_t = 50;
            fatality_t = 20;
            death_r = 5;
            death_c = 60 * 6 + Math.floor(Math.random() * (60 * 7))
            numRules = 2;
            numInfest = 1;
        } else if (severity_rating === 2) {
            spread_r = 10 + Math.floor(Math.random() * 5); // km
            spread_c = 3 + Math.floor(Math.random() * 1); // time (minutes) * delta_time
            mutation_c = 60 * 3 + Math.floor(Math.random() * (60 * 4)) // time (minutes) * delta_time
            curing_t = 65;
            fatality_t = 40;
            death_r = 10;
            death_c = 60 * 5 + Math.floor(Math.random() * (60 * 6))
            numRules = 2;
            numInfest = 2;
        } else {
            spread_r = 10 + Math.floor(Math.random() * 5); // km
            spread_c = 5 + Math.floor(Math.random() * 1); // time (minutes) * delta_time
            mutation_c = 60 + Math.floor(Math.random() * (60 * 2)) // time (minutes) * delta_time
            curing_t = 80;
            fatality_t = 60;
            death_r = 20;
            death_c = 60 * 4 + Math.floor(Math.random() * (60 * 5))
            numRules = 3;
            numInfest = 2;
        }
        
        await Axios.post('http://localhost:3001/api/insert-plague', {
            variant: 1,
            id: simID,
            strength: 1,
            spread_chance: 20,
            spread_radius: spread_r, 
            spread_cooldown: spread_c, 
            mutation_chance: mutation_c,
            curing_threshhold: curing_t, 
            fatality_threshhold: fatality_t,
            death_rate: death_r,
            death_cooldown: death_c
        })

        // name, min, max, rule_size
        var ruleList = [["temperature", 10, 40, 5], ["humidity", 20, 60, 5], ["elevation", 1, 3, 1], ["age", 15, 80, 25], 
            ["weight", 80, 280, 100], ["height", 80, 220, 80], ["blood_sugar", 60, 280, 100], 
            ["blood_pressure", 60, 160, 30], ["cholesterol", 20, 100, 30], ["radiation", 40, 3000, 1000]];
        
        ruleList.sort(() => 0.5 - Math.random());

        // later, pick 2 humans to start with, and use their stat as rules

        var ruleValues = [];
        for (var i = 1; i <= numRules; ++i) {
            var start = ruleList[i][1] + Math.floor(Math.random() * (ruleList[i][2] - ruleList[i][1] - ruleList[i][3]))
            var variant = 1;
            var id = simID;
            var category = ruleList[i][0];
            var range_lower = start;
            var range_upper = start + ruleList[i][3];
            var match_value = 10 + Math.floor(Math.random() * (40));
            var miss_value = 10 + Math.floor(Math.random() * (40));
            ruleValues.push([variant, id, category, range_lower, range_upper, match_value, miss_value]);
        }

        await Axios.post('http://localhost:3001/api/insert-plague-rule', {
            values: ruleValues
        })
        
        var humanIds = [];
        for (var i = 1; i <= totalPopulation; ++i) humanIds.push(i);
        humanIds.sort(() => 0.5 - Math.random());

        var infestValues = [];
        for (var i = 1; i <= numInfest; ++i) {
            infestValues.push([i, simID, 1, simID, 0]);
        }
        await Axios.post('http://localhost:3001/api/infest', {
            infestValues: infestValues
        })
    }

    useEffect(() => { 
        if (simID === 0) return;
        console.log(simID);
        InsertParticipation().then(() => {
            InsertSimulationHumans().then(() => {
                InsertPlague().then(() => {
                    navigate("/Mainpage");
                })
            })
        }) 
    }, [simID]);

    // const GenerateSimulation = async () => {
    //     for (var i = 0; i < 1000; ++i) {
    //         InsertSim().then(() => {
    //             InsertParticipation().then(() => {
    //                 InsertSimulationHumans().then(() => {
    //                     InsertPlague().then(() => {
    //                         navigate("/Mainpage");
    //                     })
    //                 })
    //             }) 
    //         })
    //     }
    // }

    const InsertParticipation = async () => {
        // check if cookie exists
        var username = null
        if (cookies.name != null)
        {
            username = cookies.name
        }
        else
        {
            // redirect to login
            navigate("/Login");
        }

        await Axios.post('http://localhost:3001/api/insert-sim-participation', {
            id: simID,
            owner: 1,
            //assistant_username: username
            username: 'robert'
        })
        
        for (var i = 0; i < assistants.length; ++i) {
            await Axios.post('http://localhost:3001/api/insert-sim-participation', {
                id: simID,
                owner: 0,
                username: assistants[i].title
            })
        }
    }

    const InsertSimulationHumans = async () => {
        const gridGap = 60;
        var stageW = stageWidth - gridGap * 2; 
        var stageH = stageHeight - gridGap * 2;
        var donationRate = randomNumberInRange(20, 50);
        var values = [];
        
        var positions = [];
        for (var i = 0; i < stageW / gridGap; ++i) {
            for (var j = 0; j < stageH / gridGap; ++j) {
                positions.push([i, j]);
            }
        }
        positions.sort(() => 0.5 - Math.random());
        
        for (var i = 0; i < totalPopulation; ++i) {
            var curName = "";
            var curGender = "M";
            if (randomNumberInRange(1, 2) == 2) {
                curGender = "F";
                curName = names.femaleFirstName[randomNumberInRange(0, names.femaleFirstName.length - 1)];
            } else {
                curName = names.maleFirstName[randomNumberInRange(0, names.maleFirstName.length - 1)];
            }
            curName += " " + names.lastName[randomNumberInRange(0, names.lastName.length - 1)];

            values.push(
                [i + 1,
                    simID,
                    "alive",
                    0,
                    randomNumberInRange(15, 80),
                    randomNumberInRange(80, 280),
                    randomNumberInRange(80, 220),
                    randomNumberInRange(60, 280),
                    randomNumberInRange(60, 160),
                    randomNumberInRange(20, 100),
                    randomNumberInRange(40, 3000),
                    gridGap - stageW/2 + positions[i][0] * gridGap - 8 + randomNumberInRange(0, 16),
                    gridGap - stageH/2 + positions[i][1] * gridGap - 8 + randomNumberInRange(0, 16),
                    randomNumberInRange(0, donationRate * 2),
                    null,
                    curName,
                    curGender]);
        }
        await Axios.post('http://localhost:3001/api/insert-sim-human', {values: values})
    }

    const removeAssistant = (name) => {
        setAssistants((current) =>
            current.filter((assistant) => assistant.title !== name)
        );
        var curIdx = 0;
        assistants.forEach((assistant) => {
            assistant.idx = curIdx;
            ++curIdx;
        })
        setNextAssistant(assistants.length);
    }

    const addAssistant = (name) => {
        if (assistants.length > 3) {
            return;
        }
        var exist = false;
        assistants.forEach((assistant) => {
            if (assistant.title === name) {
                exist = true;
            }
        })
        if (exist) {
            return;
        }
        setAssistants(user => [...user,
            {key: name, idx: nextAssistant, 
                title: name, function: removeAssistant}
        ])
        setNextAssistant(nextAssistant + 1);
    }

    let navigate = useNavigate();
    return (
        <div className = "CreateSim">
            <label style={{fontWeight: 'bold'}}>Disease Name</label>
            <div className="horizontal">
                <input value = {bacteriumName} 
                    type = "text" 
                    name = "Disease Name" 
                    onChange = {(e) => {
                        setBacteriumName(e.target.value);
                    }}/>
            </div>
            <label style={{fontWeight: 'bold', margin: '20px 0px 0px 0px'}}>Level of Severity</label>
            <div className="horizontal" onChange = {(e) => {setSeverity(e.target.value)}}>
                <div className = "verticle">
                    <label>Average</label>
                    <input style={{accentColor: 'black'}} type="radio" value="Average" name="severity"/>  
                </div>
                <div className = "verticle">
                    <label>Strong</label>
                    <input style={{accentColor: 'black'}} type="radio" value="Strong" name="severity" /> 
                </div>
                <div className = "verticle">
                    <label>Deadly</label>
                    <input style={{accentColor: 'black'}} type="radio" value="Deadly" name="severity" />
                </div>
                <div className = "verticle">
                    <label>Random</label>
                    <input style={{accentColor: 'black'}} type="radio" value="Random" name="severity" defaultChecked/>
                </div>
            </div>
            <label style={{fontWeight: 'bold'}}>Location of Origin</label>
            <div className="horizontal" onChange = {(e) => {setOrigin(e.target.value)}}>
                <div className = "verticle">
                    <label>Outskirt</label>
                    <input style={{accentColor: 'black'}} type="radio" value="Outskirt" name="origin" /> 
                </div>
                <div className = "verticle">
                    <label>City</label>
                    <input style={{accentColor: 'black'}} type="radio" value="City" name="origin" /> 
                </div>
                <div className = "verticle">
                    <label>Metropolis</label>
                    <input style={{accentColor: 'black'}} type="radio" value="Metropolis" name="origin" /> 
                </div>
                <div className = "verticle">
                    <label>Random</label>
                    <input style={{accentColor: 'black'}} type="radio" value="Random" name="origin" defaultChecked/>
                </div>
            </div>
            <div className="horizontal">
                <label style={{fontWeight: 'bold'}}>Assistant Usernames</label>
                <label>({assistants.length}/4)</label>
            </div>
            <div className = "horizontal">
                <input type = "text" value = {assistantName} name = "Researcher Username" onChange = {(e) => {
                    setAssistantName(e.target.value);
                }}/>
                <div className = "fixed-button">
                    <button onClick={() => {
                        addAssistant(assistantName);
                        setAssistantName('');}}>Add
                    </button>
                </div>
            </div>
            {assistants.map(datapoint => 
                <AssistantEntry 
                    key={datapoint.key} 
                    title={datapoint.title} 
                    command={datapoint.function}>
                </AssistantEntry>)}
            <div className = "horizontal" style={{margin: '15px 0px 0px 0px'}}>
                <button onClick={() => {InsertSim()}}>Create</button>
                <button onClick={() => {navigate("/Mainpage")}} >Delete</button>
            </div>
        </div>
    )
}

export default CreatePage;