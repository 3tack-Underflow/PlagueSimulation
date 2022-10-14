import React, {useState} from "react";

import SimulationButton from "./SimulationButton.js";
import { useNavigate } from "react-router-dom";

function Mainpage() {
    let navigate = useNavigate();


    const printToConsole = () =>{
        console.log("123");
    }
    const [scrollObject, setScrollObject] = useState(
        [{key : 1, title: "box 1", function: printToConsole}, 
         {key : 2, title: "box 2", function: printToConsole},
         {key : 3, title: "box 3", function: printToConsole},
         {key : 4, title: "box 4", function: printToConsole}]);

    const addObject = () =>{
        setScrollObject(john => [
            ...john,
            {key : 5, title: "box 5", function: printToConsole("5")}
        ])
    }

    return (
    <div className = "Mainpage">
        <h1>Archive</h1>
        <button onClick = {() => {navigate("/Create")}}> Create Simulation </button>
        <button onClick = {addObject}>  Simulation </button>
        <div className="scroll-pane">
            {scrollObject.map(datapoint =><SimulationButton 
            title={datapoint.title} command={datapoint.function} ></SimulationButton>)}

        </div>
    </div>)
}

export default Mainpage;