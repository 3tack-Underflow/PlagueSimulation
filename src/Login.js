import React, {useEffect, useState} from "react";
import Axios from "axios";
import { useCookies } from 'react-cookie';

import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepLogged, setKeepLogged] = useState("");
  const [userList, setUserList] = useState([]);
  const [cookies, setCookie] = useCookies(['name']);

  function checkInfo() {
    // temporary cookie testing place

    //console.log(cookies.name)

    /*

    setCookie('name', username, { path: '/' }); // temporarily here while I figure out this login thing

    var len = userList.length;
    console.log(userList)
    for (var i = 0; i < len; i++) {
      if (userList[i].username === username  && userList[i].password === password) {
        // add a cookie onto the browser
        setCookie('name', username, { path: '/' });

        navigate("/Mainpage");
        return;
      }
    }
    alert("Username or password not match!");
    */

    console.log(username)
    console.log(password)

    Axios.post('http://localhost:3001/api/login', {
          user: username, 
          pass: password
      }).then((response) => {
        console.log(response.data[0][Object.keys(response.data[0])[0]])
      })

    return;
  }

  useEffect(() => {
    /*
    Axios.get('http://localhost:3001/api/get-login').then((response) => {
      setUserList(response.data);
    });
    */
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
          setKeepLogged(e.target.value)
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
