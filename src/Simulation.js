import React, {useState, useEffect, useRef} from "react";
import {Stage, Layer, Circle, Rect, Shape, Image} from "react-konva"
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useCookies } from 'react-cookie';
import { stageWidth, stageHeight, temperatureColors, 
    humidityColors, elevationColors, temperatureRangeMin, temperatureRangeMax, 
    humidityRangeMin, humidityRangeMax, elevationRange, units} from "./Constants.js"

function Simulation() {
    const windowUrl = window.location.search;
    const params = new URLSearchParams(windowUrl);

    const id = params.get('id')

    const mapRef = useRef(0);

    const [size, setSize] = useState({ 
        width: window.innerWidth, 
        height: window.innerHeight 
    });
    
    const [view, setView] = useState("none");
    const [simulation, setSimulation] = useState({});
    const [simHumans, setSimHumans] = useState([]);
    const [simHumansAlive, setSimHumansAlive] = useState(0);
    const [selected, setSelected] = useState(null);
    const [cookies, setCookie] = useCookies(['name']);
    var testSimId = id;

    // vaccine fields
    const [vaccineName, setVaccineName] = useState("");
    const [ruleType, setRuleType] = useState("None");
    const [ruleMin, setRuleMin] = useState(0);
    const [ruleMax, setRuleMax] = useState(0);
    const [bloodType, setBloodType] = useState(1);
    const [Elevation, setElevation] = useState(1);

    const [rules, setRules] = useState([]);

    const [nextVaccine, setNextVaccine] = useState(1);

    const ProductionCost = () => {
        var cost = 0;
        for (var i = 0; i < rules.length; ++i) {
            if (rules[i].category === "Temperature") {
                cost += (rules[i].range_upper - rules[i].range_lower + 1) * 5;
            } else if (rules[i].category === "Humidity") {
                cost += (rules[i].range_upper - rules[i].range_lower + 1) * 5;
            } else if (rules[i].category === "Elevation") {
                cost += 100;
            } else if (rules[i].category === "Age") {
                cost += (rules[i].range_upper - rules[i].range_lower + 1) * 3;
            } else if (rules[i].category === "Weight") {
                cost += (rules[i].range_upper - rules[i].range_lower + 1) * 3;
            } else if (rules[i].category === "Blood Type") {
                cost += 100;
            } else if (rules[i].category === "Blood Pressure") {
                cost += (rules[i].range_upper - rules[i].range_lower + 1) * 4;
            } else if (rules[i].category === "Cholesterol") {
                cost += (rules[i].range_upper - rules[i].range_lower + 1) * 4;
            } else if (rules[i].category === "Radiation") {
                cost += (rules[i].range_upper - rules[i].range_lower + 1) * 5;
            }
        }
        return cost;
    }

    const PrototypeCost = () => {
        return ProductionCost() * 5;
    }

    const FindUnit = (name) => {
        for (var i = 0; i < units.length; ++i) {
            if (units[i].type === name) {
                return units[i].unit;
            }
        }
        return "-";
    }

    const CheckRule = () => {
        if (ruleType === "None" || ruleMin > ruleMax) {
            return false;
        }
        return true;
    }

    const AddRule = () => {
        var min = null, max = null;
        if (ruleType == "Elevation") {
            min = Elevation;
            max = Elevation;
        } else if (ruleType == "Blood Type") {
            min = bloodType;
            max = Elevation;
        } else {
            min = ruleMin;
            max = ruleMax;
        }
        rules.push({num: rules.length + 1, vaccine: nextVaccine, id: testSimId, category: ruleType, range_lower: min, range_upper: max})
        setRules(rules);
        setRuleMax(0);
        setRuleMin(0);
    }

    const VaccineConditionsMet = () => {
        if (vaccineName === null || vaccineName.trim() === "") {
            return false;
        }
        return true;
    }

    const Prototype = () => {
        InsertVaccine();
    }

    const [UIEnabled, setUIEnabled] = useState(true);

    const Isolate = () => {
        if (simulation.environment_isolation_capacity === 0) {
            alert("Your environment isolation capacity is full!");
            return;
        }
        setUIEnabled(false);
        Axios.post('http://localhost:3001/api/isolate', {
            cost: 10, 
            simID: testSimId,
            humanID: selected.num
        }).then((res) => {
            if (res.data) {
                console.log(res.data);
                setUIEnabled(true);
                return;
            }
            let isolatedHuman = simHumans[selected.num - 1];
            isolatedHuman.isolated = 1;
            setSimHumans(simHumans.map(human => {return human.num === selected.num ? isolatedHuman : human}));
            let updated_isolation_capacity_simulation = simulation;
            --updated_isolation_capacity_simulation.environment_isolation_capacity;
            setSimulation(updated_isolation_capacity_simulation);
            setUIEnabled(true);
        });
    }

    const Unisolate = () => {
        setUIEnabled(false);
        Axios.post('http://localhost:3001/api/unisolate', {
            simID: testSimId,
            humanID: selected.num
        }).then((res) => {
            if (res.data) {
                console.log(res.data);
                setUIEnabled(true);
                return;
            }
            let unisolatedHuman = simHumans[selected.num - 1];
            unisolatedHuman.isolated = 0;
            setSimHumans(simHumans.map(human => {return human.num === selected.num ? unisolatedHuman : human}));
            let updated_isolation_capacity_simulation = simulation;
            ++updated_isolation_capacity_simulation.environment_isolation_capacity;
            setSimulation(updated_isolation_capacity_simulation);
            setUIEnabled(true);
        });
    }

    const InsertVaccine = () => {
        Axios.post('http://localhost:3001/api/prototype-vaccine', {
            id: testSimId,
            vaccineName: vaccineName
        }).then((res) => {
            InsertRules();
        });
    }

    const InsertRules = () => {
        for (var i = 0; i < rules.length; ++i) {
            Axios.post('http://localhost:3001/api/prototype-vaccine', {
                vaccine: 1,
                id: testSimId,
                category: rules[i].category,
                range_lower: rules[i].range_lower,
                range_upper: rules[i].range_upper
            });
        }
    }
    
    const GetAlive = () => {
        Axios.post('http://localhost:3001/api/get-alive', {
            simID: testSimId
        }).then((res) => {
            setSimHumansAlive(res.data[0]["totalAlive"]);
        });
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
        GetAlive();
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

    const getNumberOfElapsedCyclesToNow = (startTime, cycle_length_in_seconds) => {
        return Math.floor((new Date() - new Date(startTime)) / 1000 / cycle_length_in_seconds);
    };

    let healthyMale = new window.Image();
    healthyMale.src = "res/healthy_male.png"; 
    let healthyFemale = new window.Image();
    healthyFemale.src = "res/healthy_female.png"; 
    let cage = new window.Image();
    cage.src = "res/cage.png"; 

    let navigate = useNavigate();
    return (
        <div className = "Simulation">
            <div className = "infoPane">
                <div className = "globalInfo">
                    <div className = "title">
                        <label>
                            {simulation.sim_name}
                        </label>
                    </div>
                    <label>
                        Population: {simHumansAlive}/{simulation.environment_starting_population}
                    </label> 
                    <label> 
                        Funds: ${simulation.funds}
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
                            <input style={{accentColor: 'black'}} type="radio" value="Temperature" name="view"/>  
                            <label style={{margin: "0px"}}>
                                Temperature
                            </label>
                        </div>
                        <div className="radio-group">
                            <input style={{accentColor: 'black'}} type="radio" value="Humidity" name="view"/>  
                            <label style={{margin: "0px"}}>
                                Humidity
                            </label>
                        </div>
                        <div className="radio-group">
                            <input style={{accentColor: 'black'}} type="radio" value="Elevation" name="view"/>  
                            <label style={{margin: "0px"}}>
                                Elevation
                            </label>   
                        </div>
                    </div>
                    
                    <button>
                        Fetch Latest Data
                    </button>
                    <button onClick={() => {navigate("/Mainpage")}}>
                        Exit Simulation
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
                                Blood Type: {selected.blood_type}
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
                            <button disabled={!UIEnabled} onClick = {() => {if (selected.isolated) Unisolate(); else Isolate()}}>
                                {selected.isolated ? "Unisolate" : "Isolate"}
                            </button>
                            <button>
                                Sanitize
                            </button>
                            <div className = "mark">
                                <label>
                                    Mark:
                                </label>
                                <button style={{backgroundColor: "transparent", 
                                    width: selected.marked == null ? "30px" : "20px",
                                    height: selected.marked == null ? "30px" : "20px",
                                    borderRadius: selected.marked == null ? "15px" : "10px"}}></button>
                                <button style={{backgroundColor: "yellow", 
                                    width: selected.marked == 1 ? "30px" : "20px",
                                    height: selected.marked == 1 ? "30px" : "20px",
                                    borderRadius: selected.marked == 1 ? "15px" : "10px"}}></button>
                                <button style={{backgroundColor: "orange", 
                                    width: selected.marked == 2 ? "30px" : "20px",
                                    height: selected.marked == 2 ? "30px" : "20px",
                                    borderRadius: selected.marked == 2 ? "15px" : "10px"}}></button>
                                <button style={{backgroundColor: "red", 
                                    width: selected.marked == 3 ? "30px" : "20px",
                                    height: selected.marked == 3 ? "30px" : "20px",
                                    borderRadius: selected.marked == 3 ? "15px" : "10px"}}></button>
                                <button style={{backgroundColor: "crimson", 
                                    width: selected.marked == 4 ? "30px" : "20px",
                                    height: selected.marked == 4 ? "30px" : "20px",
                                    borderRadius: selected.marked == 4 ? "15px" : "10px"}}></button>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className = "locationMap" ref = {mapRef} style = {{position: "relative"}}> 
                {(() => {
                    if (view != "none") 
                    return <div className = "legend" 
                            style = {{position: "absolute", zIndex: "1", right: "20px", bottom: "20px"}}>
                        <div className = "title" style={{margin: "15px 0px 0px 0px"}}>
                            <label> {view} </label>
                        </div>
                        {(() => {
                            if (view == "Temperature") {
                                return (
                                    <div className = "legendGroup"> 
                                        <div className = "legendContentGroup">
                                            {temperatureColors.map(datapoint => 
                                                <div className= "legendContent" key = {temperatureColors.indexOf(datapoint)}>
                                                    <div className = "legendColor"
                                                        style={{opacity: "0.25", backgroundColor: datapoint}}>
                                                    </div>
                                                    <label>
                                                        {temperatureRangeMin[temperatureColors.indexOf(datapoint)]} - {temperatureRangeMax[temperatureColors.indexOf(datapoint)]} C°
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            } else if (view == "Humidity") {
                                return (
                                    <div className = "legendGroup"> 
                                        <div className = "legendContentGroup">
                                            {humidityColors.map(datapoint => 
                                                <div className= "legendContent" key = {humidityColors.indexOf(datapoint)}>
                                                    <div className = "legendColor"
                                                        style={{opacity: "0.25", backgroundColor: datapoint}}>
                                                    </div>
                                                    <label>
                                                        {humidityRangeMin[humidityColors.indexOf(datapoint)]} - {humidityRangeMax[humidityColors.indexOf(datapoint)]} %
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            } else if (view == "Elevation") {
                                return (
                                    <div className = "legendGroup"> 
                                        <div className = "legendContentGroup">
                                            <div className= "legendContent">
                                                <div className = "legendColor"
                                                    style={{opacity: "0.25", backgroundColor: elevationColors[0]}}>
                                                </div>
                                                <label> {elevationRange[0]} </label>
                                            </div>
                                            <div className= "legendContent">
                                                <div className = "legendColor"
                                                    style={{opacity: "0.25", backgroundColor: elevationColors[1]}}>
                                                </div>
                                                <label> {elevationRange[1]} </label>
                                            </div>
                                            <div className= "legendContent">
                                                <div className = "legendColor"
                                                    style={{opacity: "0.25", backgroundColor: elevationColors[2]}}>
                                                </div>
                                                <label> {elevationRange[2]} </label>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        })()}
                    </div>
                })()}
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
                        {temperatureColors.map(datapoint => 
                            <Rect
                                key = {temperatureColors.indexOf(datapoint)}
                                x = {-stageWidth / 2}
                                y = {-stageHeight / 2 + stageHeight / 6 * (temperatureColors.indexOf(datapoint))}
                                width = {stageWidth}
                                height = {stageHeight / 6}
                                fill = {datapoint}
                                opacity = {0.25}
                                visible = {view === "Temperature" ? 1 : 0}>
                            </Rect>
                        )}
                        {humidityColors.map(datapoint => 
                            <Rect
                                key = {humidityColors.indexOf(datapoint)}
                                x = {-stageWidth / 2 + stageWidth / 8 * (humidityColors.indexOf(datapoint))}
                                y = {-stageHeight / 2}
                                width = {stageWidth / 8}
                                height = {stageHeight}
                                fill = {datapoint}
                                opacity = {0.2}
                                visible = {view === "Humidity" ? 1 : 0}>
                            </Rect>
                        )}

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
                            visible = {view === "Elevation" ? 1 : 0}
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
                            visible = {view === "Elevation" ? 1 : 0}
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
                            visible = {view === "Elevation" ? 1 : 0}
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
                            visible = {view === "Elevation" ? 1 : 0}
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
                            visible = {view === "Elevation" ? 1 : 0}
                        />
                    </Layer>
                    <Layer>
                        {simHumans.map(datapoint => 
                            <Circle
                                key = {datapoint.num}
                                x = {datapoint.x}
                                y = {datapoint.y}
                                radius = {26}
                                strokeWidth = {datapoint.marked == null ? 0 : 5}
                                stroke = {datapoint.marked == null ? "black" : "yellow"}>
                            </Circle>
                        )}
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
                                visible = {datapoint.isolated === 1 ? 1 : 0}
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
            <div className="actionPane">
                <div className="vaccineInfo">
                    <div className = "title" style={{margin: "15px 0px 0px 0px"}}>
                        <label>
                            Vaccine Lab
                        </label>
                    </div>
                    <div className="vaccineHorizontal">
                        <img src={require('./vaccine.png')} width = "60px" height = "60px" >
                        </img>
                        <div className="vaccineVerticle">
                            <label>Name</label>
                            <input value={vaccineName} type = "vaccine" name = "Vaccine Name" onChange = {(e) => {
                                setVaccineName(e.target.value);
                            }}/>
                        </div>
                    </div>
                    <div className = "vaccineHorizontal">
                        <select value={ruleType} onChange = {(e) => {
                            setRuleType(e.target.value);
                        }}>
                            <option value="None">Select Rule</option>
                            <option value="Temperature">Temperature</option>
                            <option value="Humidity">Humidity</option>
                            <option value="Elevation">Elevation</option>
                            <option value="Age">Age</option>
                            <option value="Weight">Weight</option>
                            <option value="Blood Type">Blood Type</option>
                            <option value="Blood Pressure">Blood Pressure</option>
                            <option value="Cholesterol">Cholesterol</option>
                            <option value="Radiation">Radiation</option>
                        </select>
                        <label>
                            {ruleType === "None" ? "UNIT" : FindUnit(ruleType)}
                        </label>
                    </div>

                    <div className = "ruleCategory" hidden = {ruleType == "None" ? 1 : 0}>
                        <label style={{margin: "0px 0px 0px 0px", fontWeight: "bold"}}>{ruleType == "Blood Type" ? 
                            "Type" : ruleType == "Elevation" ? "Ground Level" : "Range"}</label></div>

                    <div className = "vaccineRules" hidden = {ruleType == "None" ? 1 : 0}>
                        {(() => {
                            if (ruleType == "Blood Type") {
                                return (
                                    <div>
                                        <select style={{margin: "0px 0px 0px 0px"}}
                                            value = {bloodType} onChange = {(e) => {setBloodType(e.target.value);}}>
                                            <option value={1}>A</option>
                                            <option value={2}>B</option>
                                            <option value={3}>O</option>
                                        </select>
                                    </div>
                                )
                            } else if (ruleType == "Elevation") {
                                return (
                                    <div>
                                        <select style={{margin: "0px 0px 0px 0px"}}
                                            value = {Elevation} onChange = {(e) => {setElevation(e.target.value);}}>
                                            <option value={1}>Low</option>
                                            <option value={2}>Mid</option>
                                            <option value={3}>High</option>
                                        </select>
                                    </div>
                                )
                            } else {
                                return (
                                    <div>
                                        <label>MIN</label>
                                        <input value={ruleMin} type = "ruleMin" name = "ruleMin" onChange = {(e) => {
                                            setRuleMin(e.target.value);
                                        }}/>
                                        <label style={{margin: "0px 0px 0px 5px"}}>MAX</label>
                                        <input value={ruleMax} type = "ruleMax" name = "ruleMax" onChange = {(e) => {
                                            setRuleMax(e.target.value);
                                        }}/>
                                    </div>
                                )
                            }
                        })()}
                    </div>
                    <div hidden = {ruleType == "None" ? 1 : 0} className="vaccineRuleOptions" onClick = {() => {if (CheckRule()) AddRule();}}
                        ><button>Add Rule</button></div>  

                    <div className = "ruleGroup">
                        {rules.map(datapoint => 
                            <label key = {datapoint.num}>
                                {datapoint.category}: {datapoint.range_lower} {datapoint.range_upper === datapoint.range_lower ? "" : " - " + datapoint.range_upper}
                            </label>
                        )}
                    </div>
                    
                    <div hidden = {rules.length > 0 ? 0 : 1} style={{margin: "20px 0px 0px 0px"}}
                        className="vaccineRuleOptions" onClick = {() => {if (VaccineConditionsMet()) Prototype();}}>
                        <button>Prototype Vaccine</button></div> 
                    
                    <label hidden = {rules.length > 0 ? 0 : 1} style={{fontWeight: "bold", margin: "10px 0px 0px 0px"}}> Prototype Cost: {PrototypeCost()} </label>
                    <label hidden = {rules.length > 0 ? 0 : 1} style={{fontWeight: "bold", margin: "10px 0px 0px 0px"}}> Production Cost: {ProductionCost()} </label>
                </div>
                <div className="actionInfo">
                    <div className = "title" style={{margin: "15px 0px 0px 0px"}}>
                        <label>Vaccine Storage</label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Simulation;