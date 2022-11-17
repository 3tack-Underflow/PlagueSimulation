import React, {useEffect, useState} from "react";
import './App.css';
import Axios from "axios";

import { useNavigate } from "react-router-dom";

function SimInfo(){
    const [simId, setSimId] = useState("");
    const [dataList, setDataList] = useState({});

    let navigate = useNavigate();

    useEffect(() => {
        Axios.post('http://localhost:3001/api/get-sim', {
            id: 25
        }).then((response) => {
          setDataList(response.data[0]);
          console.log(dataList);
        });
    }, []);
    return(
        <div className = "SimInfo">
        <h1>Simulation information</h1>
  
        <div className = "SimInfo">
          <label>Simulation Name: {dataList.sim_name}</label>
          <label>Creation Time: {dataList.creation_time}</label>
          <label>Completed Time: {dataList.completion_time}</label>
          <label>Last Modified: {dataList.last_modified_time}</label>
          <label>Starting Population: {dataList.environment_starting_population}</label>
          <label>Isolation Capacity: {dataList.environment_isolation_capacity}</label>
          <label>Deceased Population: {dataList.num_deceased}</label>
          <label>Current status: {dataList.status}</label>
          <label>Seed: {dataList.seed}</label>
          <label>Funds: {dataList.funds}</label>
          <button onClick = {() => {navigate("/Login")}}> Back to main page</button>
        </div>
      </div>
    );
}

export default SimInfo;