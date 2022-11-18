import React, {useState, useEffect, useRef} from "react";
import {Stage, Layer, Circle, Rect, Shape, Image} from "react-konva"
import Axios from "axios";
import { useCookies } from 'react-cookie';
import { stageWidth, stageHeight } from "./Constants.js"

function Simulation() {
    const mapRef = useRef(0);

    const [size, setSize] = useState({ 
        width: window.innerWidth, 
        height: window.innerHeight 
    });
    
    const [view, setView] = useState("none");
    const [simulation, setSimulation] = useState({});
    const [simHumans, setSimHumans] = useState([]);
    const [selected, setSelected] = useState(null);
    const [cookies, setCookie] = useCookies(['name']);
    var testSimId = 2523;

    const Isolate = () => {
        Axios.post('http://localhost:3001/api/isolate', {
            cost: 10, 
            simID: testSimId,
            humanID: selected.num
        })
    }

    const Unisolate = () => {
        Axios.post('http://localhost:3001/api/unisolate', {
            simID: testSimId,
            humanID: selected.num
        })
    }
    
    const LoadSimHimans = () => {
        Axios.post('http://localhost:3001/api/get-simulation_humans', {
            simID: testSimId
        }).then((response) => {
            setSimHumans(response.data);
        });
    }

    useEffect(() => {
        Axios.post('http://localhost:3001/api/get-current_simulation', {
            simID: testSimId
        }).then((response) => {
            setSimulation(response.data[0]);
        });
    }, []);

    useEffect(() => {
        LoadSimHimans();
    }, []);

    useEffect(() => {
        const checkSize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, []);

    let healthyMale = new window.Image();
    healthyMale.src = "res/healthy_male.png"; 
    let healthyFemale = new window.Image();
    healthyFemale.src = "res/healthy_female.png"; 
    let cage = new window.Image();
    cage.src = "res/cage.png"; 

    return (
        <div className = "Simulation">
            <div className = "locationMap" ref = {mapRef}> 
                <Stage
                    width = {stageWidth}
                    height = {stageHeight}
                    x = {mapRef.current.offsetWidth / 2}
                    y = {mapRef.current.offsetHeight / 2}
                    draggable = {true}
                    dragBoundFunc = {(pos) => {
                        let newY = pos.y;
                        let newX = pos.x;
                        if (pos.y > stageHeight / 2) newY = stageHeight / 2;
                        if (pos.y - mapRef.current.offsetHeight < -stageHeight / 2) newY = -stageHeight / 2 + mapRef.current.offsetHeight;
                        if (pos.x > stageWidth / 2) newX = stageWidth / 2;
                        if (pos.x - mapRef.current.offsetWidth < -stageWidth / 2) newX = -stageWidth / 2 + mapRef.current.offsetWidth;
                        return {
                          x: newX,
                          y: newY
                        };
                }}
                >
                    <Layer>
                        <Rect 
                            x = {-stageWidth / 2}
                            y = {-stageHeight / 2}
                            width = {stageWidth}
                            height = {stageHeight / 6}
                            fill = "#ff0000"
                            opacity = {0.25}
                            visible = {view === "temperature"}>
                        </Rect>
                        <Rect 
                            x = {-stageWidth / 2}
                            y = {-stageHeight / 2 + stageHeight / 6}
                            width = {stageWidth}
                            height = {stageHeight / 6}
                            fill = "#ff3033"
                            opacity = {0.25}
                            visible = {view === "temperature"}>
                        </Rect>
                        <Rect 
                            x = {-stageWidth / 2}
                            y = {-stageHeight / 2 + stageHeight / 6 * 2}
                            width = {stageWidth}
                            height = {stageHeight / 6}
                            fill = "#ff4d4d"
                            opacity = {0.25}
                            visible = {view === "temperature"}>
                        </Rect>
                        <Rect 
                            x = {-stageWidth / 2}
                            y = {-stageHeight / 2 + stageHeight / 6 * 3}
                            width = {stageWidth}
                            height = {stageHeight / 6}
                            fill = "#ff6666"
                            opacity = {0.25}
                            visible = {view === "temperature"}>
                        </Rect>
                        <Rect 
                            x = {-stageWidth / 2}
                            y = {-stageHeight / 2 + stageHeight / 6 * 4}
                            width = {stageWidth}
                            height = {stageHeight / 6}
                            fill = "#ff8080"
                            opacity = {0.25}
                            visible = {view === "temperature"}>
                        </Rect>
                        <Rect 
                            x = {-stageWidth / 2}
                            y = {-stageHeight / 2 + stageHeight / 6 * 5}
                            width = {stageWidth}
                            height = {stageHeight / 6}
                            fill = "#ff9d99"
                            opacity = {0.25}
                            visible = {view === "temperature"}>
                        </Rect>

                        <Rect 
                            x = {-stageWidth / 2}
                            y = {-stageHeight / 2}
                            width = {stageWidth / 8}
                            height = {stageHeight}
                            fill = "#0000FF"
                            opacity = {0.2}
                            visible = {view === "humidity"}>
                        </Rect>
                        <Rect 
                            x = {-stageWidth / 2 + stageWidth / 8}
                            y = {-stageHeight / 2}
                            width = {stageWidth / 8}
                            height = {stageHeight}
                            fill = "#1a1aff"
                            opacity = {0.2}
                            visible = {view === "humidity"}>
                        </Rect>
                        <Rect 
                            x = {-stageWidth / 2 + stageWidth / 8 * 2}
                            y = {-stageHeight / 2}
                            width = {stageWidth / 8}
                            height = {stageHeight}
                            fill = "#3333ff"
                            opacity = {0.2}
                            visible = {view === "humidity"}>
                        </Rect>
                        <Rect 
                            x = {-stageWidth / 2 + stageWidth / 8 * 3}
                            y = {-stageHeight / 2}
                            width = {stageWidth / 8}
                            height = {stageHeight}
                            fill = "#4d4dff"
                            opacity = {0.2}
                            visible = {view === "humidity"}>
                        </Rect>
                        <Rect 
                            x = {-stageWidth / 2 + stageWidth / 8 * 4}
                            y = {-stageHeight / 2}
                            width = {stageWidth / 8}
                            height = {stageHeight}
                            fill = "#6666ff"
                            opacity = {0.2}
                            visible = {view === "humidity"}>
                        </Rect>
                        <Rect 
                            x = {-stageWidth / 2 + stageWidth / 8 * 5}
                            y = {-stageHeight / 2}
                            width = {stageWidth / 8}
                            height = {stageHeight}
                            fill = "#8080ff"
                            opacity = {0.2}
                            visible = {view === "humidity"}>
                        </Rect>
                        <Rect 
                            x = {-stageWidth / 2 + stageWidth / 8 * 6}
                            y = {-stageHeight / 2}
                            width = {stageWidth / 8}
                            height = {stageHeight}
                            fill = "#9999ff"
                            opacity = {0.2}
                            visible = {view === "humidity"}>
                        </Rect>
                        <Rect 
                            x = {-stageWidth / 2 + stageWidth / 8 * 7}
                            y = {-stageHeight / 2}
                            width = {stageWidth / 8}
                            height = {stageHeight}
                            fill = "#b3b3ff"
                            opacity = {0.2}
                            visible = {view === "humidity"}>
                        </Rect>

                        <Shape
                            sceneFunc={(context, shape) => {
                                context.beginPath();
                                context.moveTo(-stageWidth / 2, -stageHeight / 2);
                                context.lineTo(-stageWidth / 2 + stageWidth / 4, -stageHeight / 2);
                                context.lineTo(-stageWidth / 2, stageHeight / 2);
                                context.closePath();
                                context.fillStrokeShape(shape);
                            }}
                            fill = "#00BB00"
                            opacity = {0.2}
                            visible = {view === "elevation"}
                        />
                        <Shape
                            sceneFunc={(context, shape) => {
                                context.beginPath();
                                context.moveTo(-stageWidth / 2 + stageWidth / 4, -stageHeight / 2);
                                context.lineTo(-stageWidth / 2 + stageWidth / 4 * 2, -stageHeight / 2);
                                context.lineTo(-stageWidth / 2 + stageWidth / 4, stageHeight / 2);
                                context.lineTo(-stageWidth / 2, stageHeight / 2);
                                context.closePath();
                                context.fillStrokeShape(shape);
                            }}
                            fill = "#55DD55"
                            opacity = {0.2}
                            visible = {view === "elevation"}
                        />
                        <Shape
                            sceneFunc={(context, shape) => {
                                context.beginPath();
                                context.moveTo(-stageWidth / 2 + stageWidth / 4 * 2, -stageHeight / 2);
                                context.lineTo(-stageWidth / 2 + stageWidth / 4 * 3, -stageHeight / 2);
                                context.lineTo(-stageWidth / 2 + stageWidth / 4 * 2, stageHeight / 2);
                                context.lineTo(-stageWidth / 2 + stageWidth / 4, stageHeight / 2);
                                context.closePath();
                                context.fillStrokeShape(shape);
                            }}
                            fill = "#AAFFAA"
                            opacity = {0.2}
                            visible = {view === "elevation"}
                        />
                        <Shape
                            sceneFunc={(context, shape) => {
                                context.beginPath();
                                context.moveTo(-stageWidth / 2 + stageWidth / 4 * 3, -stageHeight / 2);
                                context.lineTo(stageWidth / 2, -stageHeight / 2);
                                context.lineTo(-stageWidth / 2 + stageWidth / 4 * 3, stageHeight / 2);
                                context.lineTo(-stageWidth / 2 + stageWidth / 4 * 2, stageHeight / 2);
                                context.closePath();
                                context.fillStrokeShape(shape);
                            }}
                            fill = "#55DD55"
                            opacity = {0.2}
                            visible = {view === "elevation"}
                        />
                        <Shape
                            sceneFunc={(context, shape) => {
                                context.beginPath();
                                context.lineTo(stageWidth / 2, -stageHeight / 2);
                                context.lineTo(stageWidth / 2, stageHeight / 2);
                                context.lineTo(stageWidth / 2 - stageWidth / 4, stageHeight / 2);
                                context.closePath();
                                context.fillStrokeShape(shape);
                            }}
                            fill = "#00BB00"
                            opacity = {0.2}
                            visible = {view === "elevation"}
                        />
                    </Layer>
                    <Layer>
                        {simHumans.map(datapoint => 
                            <Image
                                key = {datapoint.num}
                                image = {datapoint.gender === "M" ? healthyMale : healthyFemale}
                                x = {datapoint.x - 25}
                                y = {datapoint.y - 25}
                                width = {50}
                                height = {50}
                                onClick={
                                    () => {
                                        setSelected(datapoint)
                                    }
                                }>
                            </Image>
                        )}
                        {simHumans.map(datapoint => 
                            <Image
                                key = {datapoint.num}
                                x = {datapoint.x - 35}
                                y = {datapoint.y - 35}
                                width = {70}
                                height = {70}
                                visible = {datapoint.isolated === 1 ? true : false}
                                image = {cage}
                                onClick={
                                    () => {
                                        setSelected(datapoint)
                                    }
                                }>
                            </Image>
                        )}
                        <Circle
                            x = {selected === null ? 0 : selected.x}
                            y = {selected === null ? 0 : selected.y}
                            radius = {30}
                            strokeWidth = {selected === null ? 0 : 4}
                            stroke = "black">
                        </Circle>
                    </Layer>
                </Stage>
            </div>
            <div className = "infoPane">
                <div className = "globalInfo">
                    <div className = "title">
                        <label>
                            {simulation.sim_name}
                        </label>
                    </div>
                    <label>
                        Population: 3/{simulation.environment_starting_population}
                    </label> 
                    <label> 
                        Funds: ${simulation.funds}
                    </label>
                    <label> 
                        Isolation Count: 0
                    </label>
                    <label> 
                        Isolation Capacity: {simulation.environment_isolation_capacity}
                    </label>
                    <label style={{fontWeight: "bold"}}> 
                        Display Range View
                    </label>
                    <div className="view-buttons" onChange = {(e) => {setView(e.target.value)}}>
                        <div className="radio-group">
                            <input style={{accentColor: 'black'}} type="radio" value="none" name="view" defaultChecked/>  
                            <label style={{margin: "0px"}}>
                                None
                            </label>
                        </div>
                        <div className="radio-group">
                            <input style={{accentColor: 'black'}} type="radio" value="temperature" name="view"/>  
                            <label style={{margin: "0px"}}>
                                Temperature
                            </label>
                        </div>
                        <div className="radio-group">
                            <input style={{accentColor: 'black'}} type="radio" value="humidity" name="view"/>  
                            <label style={{margin: "0px"}}>
                                Humidity
                            </label>
                        </div>
                        <div className="radio-group">
                            <input style={{accentColor: 'black'}} type="radio" value="elevation" name="view"/>  
                            <label style={{margin: "0px"}}>
                                Elevation
                            </label>   
                        </div>
                    </div>
                    
                    <button>
                        Open Vaccine Lab
                    </button>
                    <button>
                        Fetch Latest Data
                    </button>
                </div>
                <div className = "localInfo">
                    {selected != null &&
                        <div className = "selectedInfo">
                            <div className = "title">
                                <label>
                                    {selected.name} ({selected.gender})
                                </label>
                            </div>
                            <label>
                                Age: {selected.age}
                            </label>
                            <label>
                                Weight: {selected.weight}
                            </label>
                            <label>
                                Blood Sugar: {selected.blood_sugar}
                            </label>
                            <label>
                                Blood Pressure: {selected.blood_pressure}
                            </label>
                            <label>
                                Cholesterol: {selected.cholesterol}
                            </label>
                            <label>
                                Radiation: {selected.radiation}
                            </label>
                            <label>
                                Fund Rate: ${selected.tax}
                            </label>
                            
                            <button disabled = {simulation.funds < 50}>
                                Test: $50
                            </button>
                            <button>
                                Vaccinate
                            </button>
                            <button onClick = {() => {if (selected.isolated) Unisolate(); else Isolate()}}>
                                Isolate
                            </button>
                            <button>
                                Sanitize
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Simulation;