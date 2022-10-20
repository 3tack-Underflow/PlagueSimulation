import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

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
        <div className="horizontal2" onChange = {(e) => {setSeverity(e.target.value)}}>
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
            <button onClick={() => {console.log(bacteriumName + " " + 
                severity + " " + origin)}}>Create</button>
            <button onClick={() => {navigate("/Mainpage")}} >Delete</button>
        </div>
    </div>)
}

export default CreatePage;