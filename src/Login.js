import React, {useEffect, useState} from "react";
import Axios from "axios";
import { useCookies } from 'react-cookie';

import { useNavigate } from "react-router-dom";

function  Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepLogged, setKeepLogged] = useState(false);
  const [cookies, setCookie] = useCookies(['name']);
  var Capspool = ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M','q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m'];
  var passpool = ['!','@','#','$','%','^','&','*','(',')','1','2','3','4','5','6','7','8','9','0','Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M','q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m'];
  var generateUser = async () => {
    for (var i = 0; i < 100; i++) {
      var name = "";
      var pw = ""
      var namelen = 1 + Math.floor(Math.random() * 30);
      var passlen = 8 + Math.floor(Math.random() * 22);
      for (var j = 0; j < namelen; j++) {
        name += Capspool[Math.floor(Math.random() * 52)];
      }
      for (var j = 0; j < passlen; ++j) {
        pw += passpool[Math.floor(Math.random() * 72)];
      }
      await Axios.post('http://localhost:3001/api/insert-user', {  
        user: name, 
        pass: pw,
      })
    }
  }
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
          console.log(keepLogged)
          if (keepLogged)
          {
            setCookie('pass', password, { path: '/' })
            setCookie('remember', true, { path: '/' })
          }
          else
          {
            setCookie('remember', false, { path: '/' })
          }
          navigate("/Mainpage");
        }
      })

    return;
  }

  useEffect(() => {
    //check if cookie exists
    console.log(cookies)
    if (cookies.remember === 'true')
    {
      setUsername(cookies.name);
      setPassword(cookies.pass);
    }
  }, []);


  let navigate = useNavigate();

  return (
    <div className = "Login">
      <h1>Plague Simulation Login</h1>
      <label>Username</label>
      <div className="horizontal">
        <input value={username} type = "text" name = "Username" onChange = {(e) => {
          setUsername(e.target.value);
        }}/>
      </div>
      
      <label>Password</label>
      <div className = "horizontal">
        <input value={password} type = "password" name = "Password" onChange = {(e) => {
          setPassword(e.target.value);
        }}/>
      </div>
      
      <div className = "horizontal">
        <input type = "checkbox" name = "keepLogged" style={{width: "20px", margin: "5px"}} onChange = {(e) => {
          setKeepLogged(e.target.checked)
        }}/>
        <label>Remember Me</label>
      </div>

      <div className = "horizontal">
        <button style = {{margin: '20px 10px 10px 0px'}} onClick = {() => {checkInfo()}}> Login </button>
        <button style = {{margin: '20px 0px 10px 10px'}} onClick = {() => {navigate("/Register")}}> Register </button>
        <button onClick = {() => {generateUser()}}> Generate 100 New Users</button>
      </div>
    </div>
  );
}

export default Login;
