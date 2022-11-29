import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

import AssistantEntry from "./AssistantEntry.js";
import { useCookies } from 'react-cookie';
import { names, stageWidth, stageHeight, gridGap, cycle_length_in_seconds } from "./Constants.js"
import { ElevationRange, HumidityRange, TemperatureRange, Distance, MatchAllRules } from "./Functions.js"

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
    var username = 'april'

    var simHumans = [];

    const bloodTypes = ["A", "B", "O"];
    const [factoryX, setFactoryX] = useState(50);
    const [factoryY, setFactoryY] = useState(50);
    var invalidLocations = [];

    const InsertSim = async () => {
        var origin_rating;
        if (origin === 'Random') origin_rating = Math.floor(Math.random() * 3) + 1;
        else if (origin === 'Outskirt') origin_rating = 1;
        else if (origin === 'City') origin_rating = 2;
        else origin_rating = 3;
        
        var starting_population = 0;
        if (origin_rating === 1) starting_population = 45 + Math.floor(Math.random() * 31);
        else if (origin_rating === 2) starting_population = 125 + Math.floor(Math.random() * 51);
        else starting_population = 250 + Math.floor(Math.random() * 101);
        setTotalPopulation(starting_population);
        
        var facX = randomNumberInRange(11, stageWidth / gridGap - 11);
        var facY = randomNumberInRange(6, stageHeight / gridGap - 6);
        var stageW = stageWidth - gridGap * 2; 
        var stageH = stageHeight - gridGap * 2;
        var facXCoord = gridGap - stageW/2 + facX * gridGap;
        var facYCoord = gridGap - stageH/2 + facY * gridGap;

        invalidLocations.push({x: facX, y: facY});
        invalidLocations.push({x: facX - 1, y: facY});
        invalidLocations.push({x: facX + 1, y: facY});
        invalidLocations.push({x: facX, y: facY + 1});
        invalidLocations.push({x: facX, y: facY - 1});
        invalidLocations.push({x: facX + 1, y: facY + 1});
        invalidLocations.push({x: facX - 1, y: facY - 1});
        invalidLocations.push({x: facX - 1, y: facY + 1});
        invalidLocations.push({x: facX + 1, y: facY - 1});
        setFactoryX(facXCoord);
        setFactoryY(facYCoord);

        Axios.post('http://localhost:3001/api/insert-sim', {
            disease_name: bacteriumName,
            creation_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
            completion_time: null, 
            last_modified_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
            starting_population: starting_population, 
            isolation_capacity: 10, 
            sim_status: "Ongoing",
            num_deceased: 0, 
            seed: "abcd", 
            funds: 1000,
            update: new Date().toISOString().slice(0, 19).replace('T', ' '),
            factoryX: facXCoord, 
            factoryY: facYCoord
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
            spread_r = 10 + Math.floor(Math.random() * 5) * gridGap; // km
            spread_c = Math.floor(1 + Math.random() * 1); // percentage chance for an individual to be infected after an update
            mutation_c = 60 * 6 + Math.floor(Math.random() * (60 * 7)) // time (minutes) * delta_time
            curing_t = 50;
            fatality_t = 20;
            death_r = 5;
            death_c = 60 * 6 + Math.floor(Math.random() * (60 * 7))
            numRules = 2;
            numInfest = 1;
        } else if (severity_rating === 2) {
            spread_r = 10 + Math.floor(Math.random() * 5) * gridGap; // km
            spread_c = 3 + Math.floor(Math.random() * 1); // time (minutes) * delta_time
            mutation_c = 60 * 3 + Math.floor(Math.random() * (60 * 4)) // time (minutes) * delta_time
            curing_t = 65;
            fatality_t = 40;
            death_r = 10;
            death_c = 60 * 5 + Math.floor(Math.random() * (60 * 6))
            numRules = 2;
            numInfest = 2;
        } else {
            spread_r = (10 + Math.floor(Math.random() * 5)) * gridGap; // km
            spread_c = 5 + Math.floor(Math.random() * 1); // time (minutes) * delta_time
            mutation_c = 60 + Math.floor(Math.random() * (60 * 2)) // time (minutes) * delta_time
            curing_t = 80;
            fatality_t = 60;
            death_r = 20;
            death_c = 60 * 4 + Math.floor(Math.random() * (60 * 5))
            numRules = 2;
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

        simHumans.sort(() => 0.5 - Math.random());
        simHumans.sort(() => 0.5 - Math.random());

        var status = simHumans[0];
        var patientZero = status.val;

        var ruleValues = [];
        for (var i = 1; i <= numRules; ++i) {
            var randRule = Math.floor(Math.random() * 8);
            var category, range_lower, range_upper;
            var radiationChance = 0;
            var distToFactory = DistanceToFactory(patientZero[11], patientZero[12]);
            var ruleFound = false;
            if (distToFactory < 500) radiationChance = 2;
            else if (distToFactory < 1000) radiationChance = 3;
            else if (distToFactory < 1500) radiationChance = 5;
            if (radiationChance > 0 && randomNumberInRange(1, radiationChance) == 1) {
                ruleFound = true;
                category = "radiation";
                range_lower = patientZero[10] - randomNumberInRange(100, 500);
                range_upper = stageWidth * 2;
            }
            if (!ruleFound) {
            if (randRule === 0) {
                category = "temperature";
                var level = TemperatureRange(patientZero[12]);
                if (level === 1) {
                    range_lower = 1;
                    range_upper = 2;
                } else if (level === 6) {
                    range_lower = 5;
                    range_upper = 6;
                } else {
                    if (Math.floor(Math.random() * 2)=== 0) {
                        range_lower = level;
                        range_upper = level + 1;
                    } else {
                        range_lower = level - 1;
                        range_upper = level;
                    }
                }
            } else if (randRule == 1) {
                category = "humidity"
                var level = HumidityRange(patientZero[11]);
                if (level === 1) {
                    range_lower = 1;
                    range_upper = 2;
                } else if (level === 8) {
                    range_lower = 7;
                    range_upper = 8;
                } else {
                    if (Math.floor(Math.random() * 2) == 0) {
                        range_lower = level;
                        range_upper = level + 1;
                    } else {
                        range_lower = level - 1;
                        range_upper = level;
                    }
                }
            } else if (randRule == 8) {
                category = "elevation";
                var level = ElevationRange(patientZero[11], patientZero[12]);
                range_lower = level;
                range_upper = level;
            } else if (randRule == 2) {
                category = "age";
                if (patientZero[4] <= 30) {
                    range_lower = 15;
                    range_upper = 30;
                } else if (patientZero[4] <= 45) {
                    range_lower = 30;
                    range_upper = 45;
                } else {
                    range_lower = 45;
                    range_upper = 85;
                }
            } else if (randRule == 3) {
                category = "weight"
                if (patientZero[5] <= 135) {
                    range_lower = 80;
                    range_upper = 140;
                } else if (patientZero[5] <= 180) {
                    range_lower = 140;
                    range_upper = 180;
                } else {
                    range_lower = 180;
                    range_upper = 280;
                }
            } else if (randRule == 4) {
                category = "height"
                if (patientZero[6] <= 165) {
                    range_lower = 120;
                    range_upper = 160;
                } else if (patientZero[8] <= 185) {
                    range_lower = 160;
                    range_upper = 185;
                } else {
                    range_lower = 180;
                    range_upper = 220;
                }
            } else if (randRule == 5) {
                category = "blood_type"
                var type = bloodTypes.indexOf(patientZero[7]) + 1;
                range_lower = type;
                range_upper = type;
            } else if (randRule == 6) {
                category = "blood_pressure"
                if (patientZero[8] <= 95) {
                    range_lower = 60;
                    range_upper = 95;
                } else if (patientZero[8] <= 120) {
                    range_lower = 95;
                    range_upper = 120;
                } else {
                    range_lower = 120;
                    range_upper = 160;
                }
            } else if (randRule == 7) {
                category = "cholesterol"
                if (patientZero[9] <= 130) {
                    range_lower = 80;
                    range_upper = 140;
                } else if (patientZero[9] <= 210) {
                    range_lower = 130;
                    range_upper = 210;
                } else {
                    range_lower = 200;
                    range_upper = 260;
                }
            } 
            }
            var variant = 1;
            var id = simID;
            var match_value = 10 + Math.floor(Math.random() * (40));
            var miss_value = 10 + Math.floor(Math.random() * (40));
            ruleValues.push([variant, id, category, range_lower, range_upper, match_value, miss_value]);
        }

        await Axios.post('http://localhost:3001/api/insert-plague-rule', {
            values: ruleValues
        })

        var infestValues = [];
        var initialInfected = new Date();
        initialInfected.setDate(initialInfected.getDate() - 7 * cycle_length_in_seconds);
        infestValues.push([patientZero[0], simID, 1, simID, 1, 
            initialInfected.toISOString().slice(0, 19).replace('T', ' '), 8]);

        var curInfest = 1;
        for (var i = 1; i < simHumans.length; ++i) {
            if (curInfest === numInfest) {
                break;
            }
            var simHuman = simHumans[i].val;
            if (Distance(simHuman[11], simHuman[12], patientZero[11], patientZero[12]) <= spread_r) {
                if (MatchAllRules(simHuman, ruleValues)) {
                    var infectedTime = new Date();
                    infectedTime.setDate(infectedTime.getDate() - (Math.floor(Math.random() * 6) + 1) * cycle_length_in_seconds);
                    infestValues.push([simHuman[0], simID, 1, simID, 0, 
                        infectedTime.toISOString().slice(0, 19).replace('T', ' '), 8]);
                    curInfest++;
                }
            }
        }

        await Axios.post('http://localhost:3001/api/infest', {
            infestValues: infestValues
        })
    }

    useEffect(() => { 
        // check if cookie exists
        if (cookies.name != null) {
            username = cookies.name
        } else {
            navigate("/Login");
        }

        if (simID === 0) return;
        InsertParticipation().then(() => {
            InsertSimulationHumans().then(() => {
                InsertPlague().then(() => {
                    navigate("/Mainpage");
                })
            })
        }) 
    }, [simID]);

    const handleButton = event => {
        event.currentTarget.disabled = true;
        InsertSim();
    };

    const InsertParticipation = async () => {
        // check if cookie exists
        var username = null
        if (cookies.name != null) {
            username = cookies.name;
        } else {
            navigate("/Login");
        }

        await Axios.post('http://localhost:3001/api/insert-sim-participation', {
            id: simID,
            owner: 1,
            //assistant_username: username
            username: username
        })
        
        for (var i = 0; i < assistants.length; ++i) {
            await Axios.post('http://localhost:3001/api/insert-sim-participation', {
                id: simID,
                owner: 0,
                username: assistants[i].title
            })
        }
    }

    const DistanceToFactory = (x1, y1) => {
        return Math.sqrt((factoryX - x1) * (factoryX - x1) + (factoryY - y1) * (factoryY - y1));
    }
    
    const InsertSimulationHumans = async () => {
        var stageW = stageWidth - gridGap * 2; 
        var stageH = stageHeight - gridGap * 2;
        var donationRate = randomNumberInRange(20, 50);
        var values = [];
        
        var positions = [];
        for (var i = 0; i < Math.floor(stageW / gridGap) - 1; ++i) {
            for (var j = 0; j < Math.floor(stageH / gridGap) - 1; ++j) {
                var canAdd = true;
                for (var k = 0; k < invalidLocations.length; ++k) {
                    if (invalidLocations[k].x === i && invalidLocations[k].y === j) {
                        canAdd = false;
                        break;
                    }
                }
                if (canAdd) {
                    positions.push([i, j]);
                }
            }
        }

        positions.sort(() => 0.5 - Math.random());
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
            
            // setting unique random variables
            var age = randomNumberInRange(15, 95);
            if (age > 55) age = randomNumberInRange(15, 95);
            if (age > 75) age = randomNumberInRange(15, 95);
            
            var weight = randomNumberInRange(80, 280);
            if (weight < 130) weight = randomNumberInRange(80, 180);
            if (weight > 180) weight = randomNumberInRange(130, 280);
            if (weight > 180) weight = randomNumberInRange(130, 280);

            var height = randomNumberInRange(120, 220);
            if (height < 150) height = randomNumberInRange(120, 185);
            if (height > 185) height = randomNumberInRange(150, 220);

            var bloodPressure = randomNumberInRange(60, 160);
            if (bloodPressure >= 80 && bloodPressure <= 120 && age >= 50) {
                var rand = Math.floor(Math.random() * 3);
                if (rand == 0) bloodPressure = randomNumberInRange(120, 160);
                else if (rand == 1) bloodPressure = randomNumberInRange(60, 80);
                else bloodPressure = randomNumberInRange(80, 120);
            } else if (age < 50 && (bloodPressure < 80 || bloodPressure >= 120)) {
                bloodPressure = randomNumberInRange(65, 155);
            }
            
            var cholesterol = randomNumberInRange(80, 260);
            if (cholesterol >= 140 && cholesterol <= 200 && weight >= 180) cholesterol = randomNumberInRange(140, 260);
            else if (cholesterol >= 140 && cholesterol <= 200 && weight <= 130) cholesterol = randomNumberInRange(80, 200);
            else if (weight >= 130 && weight <= 180 && (cholesterol <= 140 || cholesterol > 200)) cholesterol = randomNumberInRange(50, 250);

            var dist = Distance(gridGap - stageW/2 + positions[i][0] * gridGap, gridGap - stageH/2 + positions[i][1] * gridGap, factoryX, factoryY);
            var radiation = 50 + stageWidth * 2 - dist;

            var simHuman = {
                val: [i + 1, // id 0
                simID, // simID 1
                "alive", // status 2
                0, // isolated 3
                age, // age 4
                weight, // weight 5
                randomNumberInRange(80, 220), //height 6
                bloodTypes[randomNumberInRange(0, 2)], // blood type 7
                bloodPressure, // blood pressure 8
                cholesterol, // cholesterol 9
                radiation, // radiation 10
                gridGap - stageW/2 + positions[i][0] * gridGap - 8 + randomNumberInRange(0, 16), // x 11
                gridGap - stageH/2 + positions[i][1] * gridGap - 8 + randomNumberInRange(0, 16), // y 12
                randomNumberInRange(0, donationRate * 2), // tax 13
                null, // mark 14
                curName, // name 15
                curGender], // gender 16
                x: positions[i][0], y: positions[i][1]}; 

            simHumans.push(simHuman);

            values.push(simHuman.val);
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
                    <label>Village</label>
                    <input style={{accentColor: 'black'}} type="radio" value="City" name="origin" /> 
                </div>
                <div className = "verticle">
                    <label>Town</label>
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
                <button onClick={handleButton}>Create</button>
                <button onClick={() => {navigate("/Mainpage")}} >Delete</button>
            </div>
        </div>
    )
}

export default CreatePage;