import React, {useEffect, useState} from "react";
import Axios from "axios";
import { useCookies } from 'react-cookie';

import { useNavigate } from "react-router-dom";

function  Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepLogged, setKeepLogged] = useState(false);
  const [cookies, setCookie] = useCookies(['name']);
  const [sims, setSims] = useState([]);
  var Capspool = ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M','q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m'];
  var passpool = ['!','@','#','$','%','^','&','*','(',')','1','2','3','4','5','6','7','8','9','0','Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M','q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m'];
  var generateUser = async () => {
    await Axios.post('http://localhost:3001/api/get-all-sims').then((response) => {
        setSims(response.data);
    });
    for (var i = 0; i < 100; i++) {
      var name = "";
      var pw = ""
      var namelen = 1 + Math.floor(Math.random() * 30);
      var passlen = 8 + Math.floor(Math.random() * 22);
      for (var j = 0; j < namelen; j++) {
        name += Capspool[Math.floor(Math.random() * 52)];
      }
      for (j = 0; j < passlen; ++j) {
        pw += passpool[Math.floor(Math.random() * 72)];
      }
      for (j = 0 ; j < sims.length ; ++j) {
          // insert into simulations
          if (Math.floor(Math.random() * 100) === 1) {
            await Axios.post('http://localhost:3001/api/insert-sim-participation', {  
                username : name,
                id : sims[j].id,
                owner : false
            })
          }
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
      </div>
    </div>
  );
}

const PERMUTATION = [
  151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,
  140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,
  247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,
  57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,
  74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,
  60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,
  65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,
  200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,
  52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,
  207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,
  119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,
  129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,
  218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,
  81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,
  184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,
  222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
];

const P = [...PERMUTATION, ...PERMUTATION];

class Perlin {
  constructor(seed = 3000) {
      this._seedValue = Perlin.xorshift(seed);

      this.noise = this.noise.bind(this);
      this.setSeed = this.setSeed.bind(this);
  }

  static xorshift(value) {
      let x = value ^ (value >> 12);
      x = x ^ (x << 25);
      x = x ^ (x >> 27);
      return x * 2;
  }

  static lerp(t, a, b) {
      return a + t * (b - a);
  }

  static fade(t) {
      return t * t * t * (t * (t * 6 - 15) + 10);
  }

  static grad(hash, x, y, z) {
      var h = hash & 15,
          u = h<8 ? x : y,
          v = h<4 ? y : h===12||h===14 ? x : z;
      return ((h&1) === 0 ? u : -u) + ((h&2) === 0 ? v : -v);
  }

  setSeed(seed = 3000) {
      this._seedValue = Perlin.xorshift(seed);
  }

  noise(a, b, c) {
      let x = a + this._seedValue;
      let y = b + this._seedValue;
      let z = c + this._seedValue;

      const X = Math.floor(x) & 255;
      const Y = Math.floor(y) & 255;
      const Z = Math.floor(z) & 255;

      x -= Math.floor(x);
      y -= Math.floor(y);
      z -= Math.floor(z);

      const u = Perlin.fade(x);
      const v = Perlin.fade(y);
      const w = Perlin.fade(z);

      const A = P[X  ]+Y, AA = P[A]+Z, AB = P[A+1]+Z;
      const B = P[X+1]+Y, BA = P[B]+Z, BB = P[B+1]+Z;

      return Perlin.lerp(w,
          Perlin.lerp(v,
              Perlin.lerp(u, Perlin.grad(P[AA], x, y, z), Perlin.grad(P[BA], x-1, y, z)),
              Perlin.lerp(u, Perlin.grad(P[AB], x, y-1, z), Perlin.grad(P[BB], x-1, y-1, z))
          ),
          Perlin.lerp(v,
              Perlin.lerp(u, Perlin.grad(P[AA+1], x, y, z-1), Perlin.grad(P[BA+1], x-1, y, z-1)),
              Perlin.lerp(u, Perlin.grad(P[AB+1], x, y-1, z-1), Perlin.grad(P[BB+1], x-1, y-1, z-1))
          )
      )
  }
}

export default Login;
