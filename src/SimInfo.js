import React, {useEffect, useState} from "react";
import './App.css';
import Axios from "axios";

import { useNavigate } from "react-router-dom";

function SimInfo(){
    const [simId, setSimId] = useState("");
    const [dataList, setDataList] = useState({});
    const windowUrl = window.location.search;
    const params = new URLSearchParams(windowUrl);

    const id = params.get('id')

    let navigate = useNavigate();
    
    const DeleteSim = () => {
        Axios.post('http://localhost:3001/api/delete-sim', {
            simID: id
        }).then((response) => {
            navigate("/Mainpage");
        });
    }

    useEffect(() => {
        Axios.post('http://localhost:3001/api/get-sim', {
            id: id
        }).then((response) => {
          setDataList(response.data[0]);
        });
    }, []);

    return (
        <div className = "SimInfo">
            <label>{dataList.sim_name}</label>
            <div className = "Info">
                <label>Creation Time: {dataList.creation_time}</label>
                <label>Completed Time: {dataList.completion_time}</label>
                <label>Last Modified: {dataList.last_modified_time}</label>
                <label>Starting Population: {dataList.environment_starting_population}</label>
                <label>Isolation Capacity: {dataList.environment_isolation_capacity}</label>
                <label>Deceased Population: {dataList.num_deceased}</label>
                <label>Current status: {dataList.status}</label>
                <label>Funds: {dataList.funds}</label>
                <div className = "horizontal">
                    <button onClick = {() => {navigate("/Simulation?id=" + id)}}> Enter</button>
                    <button onClick = {() => {DeleteSim()}}> Delete</button>
                    <button onClick = {() => {navigate("/Mainpage")}}> Back</button>
                </div>
            </div>
      </div>
    );
}

export default SimInfo;