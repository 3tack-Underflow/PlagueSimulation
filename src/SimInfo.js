import React, {useEffect, useState} from "react";
import './App.css';
import Axios from "axios";

import { useNavigate } from "react-router-dom";
import styled from 'styled-components'; 

const MainButton = styled.button`
  background-color: #7600b5;
  color: white;
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 5px;
  margin: 10px 0px;
  cursor: pointer;
`;

function SimInfo(){
    const [simId, setSimId] = useState("");
    const [dataList, setDataList] = useState({});

    let navigate = useNavigate();

    useEffect(() => {
        Axios.post('http://localhost:3001/api/getSim', {
            id: 1  
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
          <MainButton onClick = {() => {navigate("/Login")}}> Back to main page</MainButton>
        </div>
      </div>
    );
}

export default SimInfo;