import React, {useState, useEffect} from "react";
import Axios from "axios";

import SimulationButton from "./SimulationButton.js";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

function Mainpage() {
    const [simList, setSimList] = useState([]);
    const [cookies, setCookie] = useCookies(['name']);

    let navigate = useNavigate();
    useEffect(() => {
        // check if cookie exists
        // var username = null
        // if (cookies.name != null)
        // {
        //     username = cookies.name
        // }
        // else
        // {
        //     // redirect to login
        //     navigate("/Login");
        // }
        
        // console.log(username)
        // Axios.post('http://localhost:3001/api/get-sims', 
        // {username: username}).then((response) => {
        //     setSimList(response.data);
        // });

        Axios.post('http://localhost:3001/api/get-sims', 
        {user: 'robert'}).then((response) => {
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
                title={datapoint.sim_name}>
            </SimulationButton>
            )}
        </div>
    </div>)
}

export default Mainpage;