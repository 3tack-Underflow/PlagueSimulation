import React, {useEffect, useState} from "react";
import './App.css';
import Axios from "axios";

function App() {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    Axios.get('http://localhost:3001/api/get').then((response) => {
      setUserList(response.data);
    });
  }, []);

  const loginAction = () => {
    Axios.post('http://localhost:3001/api/insert', {
      user: Username, 
      pass: Password
    }).then(() => {
      alert("successful insert");
    });
  }

  return (
    <div className = "App">
      <h1>Plague Doctor</h1>

      <div className = "Login">
        <label>Username</label>
        <input type = "text" name = "Username" onChange = {(e) => {
          setUsername(e.target.value);
        }}/>
        <label>Password</label>
        <input type = "text" name = "Password" onChange = {(e) => {
          setPassword(e.target.value);
        }}/>

        <button onClick = {loginAction}> Login </button>
        <button onClick = {loginAction}> Register </button>

        {userList.map((val) => {
          return <h1>username: {val.Username} | password: {val.Password}</h1>
        })}
      </div>

    </div>
  );
}

export default App;
