import React, {useEffect, useState} from "react";
import './App.css';
import Axios from "axios";

import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    Axios.get('http://localhost:3001/api/get').then((response) => {
      setUserList(response.data);
    });
  }, []);

  const loginAction = () => {
    Axios.post('http://localhost:3001/api/insert', {
      user: username, 
      pass: password
    }).then(() => {
      alert("successful insert");
    });
  }

  let navagate = useNavigate();

  return (
    <div className = "Login">
      <h1>Plague Simulation</h1>

      <div className = "Login">
        <label>Username</label>
        <input type = "text" name = "Username" onChange = {(e) => {
          setUsername(e.target.value);
        }}/>
        <label>Password</label>
        <input type = "text" name = "Password" onChange = {(e) => {
          setPassword(e.target.value);
        }}/>

        <button onClick = {() => {navagate.push("/mainpage")}}> Login </button>
        <button onClick = {loginAction}> Register </button>
        {userList.map((val) => {
          return <h1>username: {val.username} | password: {val.password}</h1>
        })}
      </div>

    </div>
  );
}

export default Login;
