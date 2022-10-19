import React, {useState} from "react";

import SimulationButton from "./SimulationButton.js";
import { useNavigate } from "react-router-dom";

function Mainpage() {
    let navigate = useNavigate();

    const printToConsole = () =>{
        console.log("123");
    }

    const [scrollObject, setScrollObject] = useState(
        [{key: "box 1", title: "box 1", function: printToConsole}, 
         {key: "box 2", title: "box 2", function: printToConsole},
         {key: "box 3", title: "box 3", function: printToConsole},
         {key: "box 4", title: "box 4", function: printToConsole}]);

    const addObject = () =>{
        setScrollObject(john => [
            ...john,
            {key : 5, title: "box 5", function: printToConsole("5")}
        ])
    }

    return (
    <div className = "Mainpage">
        <label>Archive</label>
        <button onClick = {() => {navigate("/Create")}}> Host Simulation </button>
        {/* {<button onClick = {addObject}>  Simulation </button> } */}
        <div className = "scroll-pane">
            {scrollObject.map(datapoint => 
            <SimulationButton 
                key={datapoint.key}
                title={datapoint.title} 
                command={datapoint.function}>
            </SimulationButton>)}
        </div>
    </div>)
}

export default Mainpage;