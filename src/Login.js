import React, {useEffect, useState} from "react";
import Axios from "axios";
import { useCookies } from 'react-cookie';

import { useNavigate } from "react-router-dom";

//import perlinNoise3d from 'perlin-noise-3d'
// import Perlin from './Noise.js'
// import { makeRectangle } from 'fractal-noise';
 
let perlin = {
    rand_vect: function(){
        let theta = Math.random() * 2 * Math.PI;
        return {x: Math.cos(theta), y: Math.sin(theta)};
    },
    dot_prod_grid: function(x, y, vx, vy){
        let g_vect;
        let d_vect = {x: x - vx, y: y - vy};
        if (this.gradients[[vx,vy]]){
            g_vect = this.gradients[[vx,vy]];
        } else {
            g_vect = this.rand_vect();
            this.gradients[[vx, vy]] = g_vect;
        }
        return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
    },
    smootherstep: function(x){
        return 6*x**5 - 15*x**4 + 10*x**3;
    },
    interp: function(x, a, b){
        return a + this.smootherstep(x) * (b-a);
    },
    seed: function(){
        this.gradients = {};
        this.memory = {};
    },
    get: function(x, y) {
        if (this.memory.hasOwnProperty([x,y]))
            return this.memory[[x,y]];
        let xf = Math.floor(x);
        let yf = Math.floor(y);
        //interpolate
        let tl = this.dot_prod_grid(x, y, xf,   yf);
        let tr = this.dot_prod_grid(x, y, xf+1, yf);
        let bl = this.dot_prod_grid(x, y, xf,   yf+1);
        let br = this.dot_prod_grid(x, y, xf+1, yf+1);
        let xt = this.interp(x-xf, tl, tr);
        let xb = this.interp(x-xf, bl, br);
        let v = this.interp(y-yf, xt, xb);
        this.memory[[x,y]] = v;
        return v;
    }
}
perlin.seed();

function  Login() {
  // var arr = [...Array(100)].map(e => Array(100));
  // // var output = makeRectangle(100, 50, 10, { frequency: 0.04, octaves: 8 });
  // // const noise = new perlinNoise3d();
  // // let noiseStep = 0;
  // perlin.seed();
  // for(var y = 0; y < 10; y++ ) {
  //     for (var x = 0; x < 100; ++x) {
  //         arr[x][y] = (perlin.get(x / 100, y / 100) * 100).toFixed(0);
  //     }
  // }
  
  // console.log(arr);
  

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
