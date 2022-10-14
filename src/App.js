import './App.css';

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Mainpage from "./Mainpage.js";
import Login from "./Login.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<Login />}/>
        <Route exact path = "/Mainpage" element = {<Mainpage />}/>
      </Routes>
    </Router>
  );
}

export default App;
