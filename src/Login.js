import React, {useEffect, useState} from "react";
import Axios from "axios";

import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userList, setUserList] = useState([]);

  function checkInfo() {
    var len = userList.length;
    for (var i = 0; i < len; i++) {
      if (userList[i].username === username  && userList[i].password === password) {
        navigate("/Mainpage");
        return;
      }
    }
    alert("Username or password not match!");
    return;
  }

  useEffect(() => {
    Axios.get('http://localhost:3001/api/get-login').then((response) => {
      setUserList(response.data);
    });
  }, []);


  let navigate = useNavigate();

  return (
    <div className = "Login">
      <h1>Plague Simulation Login</h1>
      <label>Username</label>
      <div className="horizontal">
        <input type = "text" name = "Username" onChange = {(e) => {
          setUsername(e.target.value);
        }}/>
      </div>
      
      <label>Password</label>
      <div className = "horizontal">
        <input type = "password" name = "Password" onChange = {(e) => {
          setPassword(e.target.value);
        }}/>
      </div>
      <div className = "horizontal">
        <button style = {{margin: '20px 10px 10px 0px'}} onClick = {() => {checkInfo()}}> Login </button>
        <button style = {{margin: '20px 0px 10px 10px'}} onClick = {() => {navigate("/Register")}}> Register </button>
      </div>
    </div>
  );
}

export default Login;
