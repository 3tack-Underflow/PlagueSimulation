import './App.css';
import './CreateSimPage.css';
import './Mainpage.css';
import './Login.css';

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Mainpage from "./Mainpage.js";
import Login from "./Login.js";
import Create from "./CreateSimPage.js";
import Register from "./Register.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<Login />}/>
        <Route path = "/Login" element = {<Login />}/>
        <Route path = "/Mainpage" element = {<Mainpage />}/>
        <Route path = "/Register" element = {<Register />}/>
        <Route path = "/Create" element = {<Create />}/>
      </Routes>
    </Router>
  );
}

export default App;
