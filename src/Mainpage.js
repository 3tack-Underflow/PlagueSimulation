import React, {useState, useEffect} from "react";
import Axios from "axios";

import SimulationButton from "./SimulationButton.js";
import { useNavigate } from "react-router-dom";

function Mainpage() {
    const [simList, setSimList] = useState([]);

    let navigate = useNavigate();

    useEffect(() => {
        Axios.get('http://localhost:3001/api/get-sims').then((response) => {
            setSimList(response.data);
        });
    }, []);

    return (
    <div className = "Mainpage">
        <label>Simulation Archive</label>
        <button onClick = {() => {navigate("/Create")}}> Host Simulation </button>
        {/* {<button onClick = {addObject}>  Simulation </button> } */}
        <div className = "scroll-pane">
            {simList.map(datapoint => 
            <SimulationButton 
                key={datapoint.id}
                title={datapoint.disease_name}>
            </SimulationButton>
            )}
        </div>
    </div>)
}

export default Mainpage;