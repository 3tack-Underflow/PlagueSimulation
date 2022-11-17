import React, {useEffect, useState} from "react";
import Axios from "axios";
import { useCookies } from 'react-cookie';

import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepLogged, setKeepLogged] = useState(false);
  const [cookies, setCookie] = useCookies(['name']);

  function checkInfo() {
    console.log(username)
    console.log(password)

    Axios.post('http://localhost:3001/api/login', {
          user: username, 
          pass: password
      }).then((response) => {
        const isValid = response.data[0][Object.keys(response.data[0])[0]]
        setCookie('name', username, { path: '/' }); 
        if (isValid)
        {
          if (keepLogged)
          {
            setCookie('pass', password, { path: '/' })
            setCookie('remember', true, { path: '/' })
          }
          navigate("/Mainpage");
        }
      })

    return;
  }

  useEffect(() => {
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
        <input type = "checkbox" name = "keepLogged" style={{width: "20px", margin: "5px"}} onChange = {(e) => {
          setKeepLogged(e.target.checked)
        }}/>
        <label>Keep me logged in</label>
      </div>

      <div className = "horizontal">
        <button style = {{margin: '20px 10px 10px 0px'}} onClick = {() => {checkInfo()}}> Login </button>
        <button style = {{margin: '20px 0px 10px 10px'}} onClick = {() => {navigate("/Register")}}> Register </button>
      </div>
    </div>
  );
}

export default Login;
