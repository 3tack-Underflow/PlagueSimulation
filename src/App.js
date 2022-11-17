import './App.css';
import './CreateSimPage.css';
import './Mainpage.css';
import './Login.css';
import './SimInfo.css';
import './Simulation.css';

import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Mainpage from "./Mainpage.js";
import Login from "./Login.js";
import Create from "./CreateSimPage.js";
import Register from "./Register.js";
import Simulation from "./Simulation.js";
import SimInfo from "./SimInfo.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<Login />}/>
        <Route path = "/Login" element = {<Login />}/>
        <Route path = "/Mainpage" element = {<Mainpage />}/>
        <Route path = "/Register" element = {<Register />}/>
        <Route path = "/SimInfo" element = {<SimInfo />}/>
        <Route path = "/Create" element = {<Create />}/>
        <Route path = "/Simulation" element = {<Simulation />}/>
      </Routes>
    </Router>
  );
}

export default App;
