import React, {useEffect, useState} from "react";
import Axios from "axios";

import { useNavigate } from "react-router-dom";

//var pass1;
var pass2;

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userList, setUserList] = useState([]);
    
    let navigate = useNavigate();

    useEffect(() => {
      Axios.get('http://localhost:3001/api/get-login').then((response) => {
        setUserList(response.data);
      });
    }, []);
    var userLen = userList.length;

    function is_valid_password() {
      var len = password.length;
      const symbols = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/
      const lowerletters = /[a-z]/
      const upperletters = /[A-Z]/
      const nums = /[0-9]/
     
      if (len < 8 || len > 30) {
        return false;
      }
      else if (!symbols.test(password) || !lowerletters.test(password) || !upperletters.test(password) || !nums.test(password)) {
        return false;
      }
      return true;
  }
    function checkReg() {
      var namelen = username.length;
      if (namelen === 0 || namelen > 30) {
        alert("Username has to be between 1 and 30 characters!");
        return;
      }
      for (var i = 0; i < userLen; i++) {
        if (userList[i].username === username) {
          alert("Username already exists!");
          return;
        }
      }
      if (password === pass2 && is_valid_password()) {
        //setPassword(pass1);
        RegisterAction();
        alert("Successfully registered!");
        navigate("/Login");
        return;
      } else if (password !== pass2) {
        alert("Password does not match!");
        return;
      } else {
        alert("Password invalid!");
        return;
      }
    }

    const RegisterAction = () => {
      Axios.post('http://localhost:3001/api/insert-user', {
        user: username, 
        pass: password,
      }).then(() => {
        alert("successful insert");
      })
    }
    return (
      <div className = "Login">
        <h1>Plague Simulation Register</h1>
        <label>Username</label>
        <div className="horizontal">
          <input type = "text" name = "Username" onChange = {(e) => {
            setUsername(e.target.value);
          }}/>
        </div>
        <label>Password</label>
        <div className="horizontal">
          <input type = "text" name = "Password" onChange = {(e) => {
            setPassword(e.target.value);
          }}/>
        </div>
        <label>Re-enter your Password</label>
        <div className="horizontal">
          <input type = "text" name = "Password" onChange = {(e) => {
            pass2 = e.target.value;
          }}/>
        </div>
        <div className="horizontal">
          <button style = {{margin: '20px 10px 10px 0px'}} onClick = {() => {checkReg()}}> Create </button>
          <button style = {{margin: '20px 0px 10px 10px'}} onClick = {() => {navigate("/Login")}}> Delete </button>
        </div>
      </div>
    );
}

export default Register;