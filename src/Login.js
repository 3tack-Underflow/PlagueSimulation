import React, {useEffect, useState} from "react";
import './App.css';
import Axios from "axios";

import { useNavigate } from "react-router-dom";
import styled from 'styled-components'; 

const LoginButton = styled.button`
  background-color: #7600b5;
  color: white;
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 5px;
  margin: 10px 0px;
  cursor: pointer;
`;

const RegisterButton = styled.button`
  background-color: #20a81b;
  color: white;
  font-size: 16px;
  border-radius: 2px;
  cursor: pointer;
`;


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userList, setUserList] = useState([]);

  function checkInfo() {
    var len = userList.length;
    for (var i = 0; i < len; i++) {
      if (userList[i].username == username  && userList[i].password == password) {
        navigate("/Mainpage");
        return;
      }
    }
    alert("Username or password not match!");
    return;
  }

  useEffect(() => {
    Axios.get('http://localhost:3001/api/get').then((response) => {
      setUserList(response.data);
    });
  }, []);


  let navigate = useNavigate();

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
        <LoginButton onClick = {() => {checkInfo()}}> Login </LoginButton>
        <RegisterButton onClick = {() => {navigate("/Register")}}> Register </RegisterButton>
      
      </div>
    </div>
  );
}

export default Login;
