import React, {useState, useEffect} from "react";
import Axios from "axios";

import SimulationButton from "./SimulationButton.js";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

function Mainpage() {
    const [simList, setSimList] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(['name']);

    let navigate = useNavigate();
    useEffect(() => {
        // check if cookie exists
        var username = null
        if (cookies.name != null) {
            username = cookies.name
        } else {
            navigate("/Login");
        }
        
        Axios.post('http://localhost:3001/api/get-sims', {
            user: username
        }).then((response) => {
            setSimList(response.data);
        });
    }, []);

    function logout() {
        removeCookie('name', { path: '/' }); 
        navigate("/Login")
    }
    
    return (
    <div className = "Mainpage">
        <div style = {{display: "flex", flexDirection: "row", width: "100%"}}>
            <label>Simulation Archive</label>
            <button onClick = {() => {logout()}} style={{width: "20%", marginLeft: "auto", marginTop: "0px", marginBottom: "0px", marginRight: "0px"}}> Logout </button>
        </div>
        <button onClick = {() => {navigate("/Create")}}> Host Simulation </button>
        {/* {<button onClick = {addObject}>  Simulation </button> } */}
        <div className = "scroll-pane">
            {simList.map(datapoint => 
            <SimulationButton 
                key={datapoint.id}
                id={datapoint.id}
                title={datapoint.sim_name}>
            </SimulationButton>
            )}
        </div>
    </div>)
}

export default Mainpage;