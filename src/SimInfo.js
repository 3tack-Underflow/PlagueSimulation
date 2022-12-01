import React, {useEffect, useState} from "react";
import { useCookies } from 'react-cookie';
import './App.css';
import Axios from "axios";

import { useNavigate } from "react-router-dom";

function SimInfo(){
    const [simId, setSimId] = useState("");
    const [dataList, setDataList] = useState({});
    const windowUrl = window.location.search;
    const params = new URLSearchParams(windowUrl);
    const [cookies, setCookie] = useCookies(['name']);
    const [creationTime, setCreationTime] = useState("");
    const [completeTime, setCompleteTime] = useState("N/A");
    const [lastModifiedTime, setLastModifiedTime] = useState("");
    const [numAlive, setNumAlive] = useState(0);

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
        if (cookies.name == null) {
          navigate("/Login");
        }
        Axios.post('http://localhost:3001/api/get-sim', {
            id: id
        }).then((res) => {
          setDataList(res.data[0]);
        });
    }, []);

    useEffect(() => {
        Axios.post('http://localhost:3001/api/get-alive', {
            simID: id
        }).then((res) => {
            setNumAlive(res.data[0]["totalAlive"]);
        });
    });
    
    useEffect(() => {
      if (dataList.completion_time != null && dataList.completion_time != "") {
        setCompleteTime(dataList.completion_time);
      }
    },[dataList]);

    useEffect(() => {
      if(dataList.creation_time != null && dataList.creation_time != "") {
        var c_time = dataList.creation_time.substring(0,10);
        setCreationTime(c_time.concat(" ", dataList.creation_time.substring(11,19)));
      }
      if (dataList.last_modified_time != null && dataList.last_modified_time != ""){
        var l_time = dataList.last_modified_time.substring(0,10);
        setLastModifiedTime(l_time.concat(" ", dataList.last_modified_time.substring(11,19)));
      }
    },[dataList])
    
    return (
        <div className = "SimInfo">
            <label>{dataList.sim_name}</label>
            <div className = "Info">
                <label>Creation Time: {creationTime}</label>
                <label>Last Modified: {lastModifiedTime}</label>
                <label>Completed: {completeTime}</label>
                <label>Population: {numAlive} / {dataList.environment_starting_population}</label>
                <label>Isolation Capacity: {dataList.environment_isolation_capacity}</label>
                <label>Deceased Population: {dataList.num_deceased}</label>
                <label>Current status: {dataList.status}</label>
                <label>Avaliable Funds: ${dataList.funds}</label>
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