import React, {useState, useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

import AssistantEntry from "./AssistantEntry.js";

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

    const isFirstRun = useRef(true);

    // add spread time, rename max_rules to starting_rules, rename spread_rate to spread chance, spread_radius will be a range and a rule, spread_cooldown, mutation_chance
    // creation time, cured status [ongoing, fail, success], completion time, 
    const InsertSim = () => {
        var severity_rating, origin_rating, max_rules, total_population, spread_rate, spread_radius, mutation_time;
        if (severity === 'Random') severity_rating = Math.floor(Math.random() * 3) + 1;
        else if (severity === 'Average') severity_rating = 1;
        else if (severity === 'Strong') severity_rating = 2;
        else severity_rating = 3;
        if (origin === 'Random') origin_rating = Math.floor(Math.random() * 3) + 1;
        else if (origin === 'Outskirt') origin_rating = 1;
        else if (origin === 'City') origin_rating = 2;
        else origin_rating = 3;
        if (severity_rating === 1) {
            severity_rating = 1;
            max_rules = 2;
            // spread_time
            spread_rate = Math.floor(1 + Math.random() * 1); // percentage chance for an individual to be infected after an update
            spread_radius = 10 + Math.floor(Math.random() * 5); // km
            // spead_cooldown
            mutation_time = 60 * 6 + Math.floor(Math.random() * (60 * 7)) // time (minutes) * delta_time
            // mutation_chance
        } else if (severity_rating === 2) {
            severity_rating = 2
            max_rules = 3;
            spread_rate = 3 + Math.floor(Math.random() * 1); // time (minutes) * delta_time
            spread_radius = 10 + Math.floor(Math.random() * 5); // km
            mutation_time = 60 * 3 + Math.floor(Math.random() * (60 * 4)) // time (minutes) * delta_time
        } else {
            severity_rating = 3
            max_rules = 4;
            spread_rate = 5 + Math.floor(Math.random() * 1); // time (minutes) * delta_time
            spread_radius = 10 + Math.floor(Math.random() * 5); // km
            mutation_time = 60 + Math.floor(Math.random() * (60 * 2)) // time (minutes) * delta_time
        }
        if (origin_rating === 1) {
            total_population = 45 + Math.floor(Math.random() * 31);
        } else if (origin_rating === 2) {
            total_population = 125 + Math.floor(Math.random() * 51);
        } else {
            total_population = 250 + Math.floor(Math.random() * 101);
        }
        // console.log(bacteriumName + ' ' + severity_rating + ' ' + max_rules + ' ' + total_population + ' ' + spread_rate + ' ' + spread_radius + ' ' + mutation_time);
        Axios.post('http://localhost:3001/api/insert-sim', {
            disease_name: bacteriumName,
            settings_severity: severity_rating, 
            settings_max_rules: max_rules, 
            environment_total_population: total_population,
            environment_isolation_capacity: 5,
            disease_spread_rate: spread_rate, 
            disease_spread_radius: spread_radius, 
            disease_mutation_time: mutation_time, 
            fund: 1000
        }).then((response) => {
            setSimID(response.data[1][0]['LAST_INSERT_ID()']);
        })
    }

    useEffect(() => { 
        if (simID == 0) return;
        console.log(simID);
        InsertParticipation();
        navigate("/Mainpage");
    }, [simID]);

    const InsertParticipation = () => {
        Axios.post('http://localhost:3001/api/insert-sim-participation', {
            simulation_ID: simID,
            owner: 1,
            assistant_username: 'robert'
        })
        for (var i = 0; i < assistants.length; ++i) {
            Axios.post('http://localhost:3001/api/insert-sim-participation', {
                simulation_ID: simID,
                owner: 0,
                assistant_username: assistants[i].title
            })
        }
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
                    <input style={{accentColor: 'black'}} type="radio" value="Average" name="severity" />  
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