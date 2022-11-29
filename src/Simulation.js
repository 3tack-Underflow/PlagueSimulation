import React, {useState, useEffect, useRef} from "react";
import {Stage, Layer, Circle, Rect, Shape, Image} from "react-konva"
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useCookies } from 'react-cookie';
import { stageWidth, stageHeight, temperatureColors, 
    humidityColors, elevationColors, temperatureRangeMin, temperatureRangeMax, 
    humidityRangeMin, humidityRangeMax, elevationRange, units, cycle_length_in_seconds} from "./Constants.js"

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
    const [infected, setInfected] = useState({});
    const [selected, setSelected] = useState(null);
    const [cookies, setCookie] = useCookies(['name']);
    var testSimId = id;

    // vaccine fields
    const [vaccineName, setVaccineName] = useState("");
    const [ruleType, setRuleType] = useState("None");
    const [ruleMin, setRuleMin] = useState(0);
    const [ruleMax, setRuleMax] = useState(0);
    const [bloodType, setBloodType] = useState(0);
    const [Elevation, setElevation] = useState(0);

    const [rules, setRules] = useState([]);

    const [nextVaccine, setNextVaccine] = useState(1);

    const [vaccineID, setVaccineID] = useState(1);
    const [vaccinesRaw, setVaccinesRaw] = useState([]);
    const [vaccines, setVaccines] = useState([]);
    const [vaccineRulesRaw, setVaccineRulesRaw] = useState([]);
    const [vaccineRules, setVaccineRules] = useState([]);
    const [selectedVaccine, setSelectedVaccine] = useState(0);

    const ProductionCost = (rules) => {
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

    const PrototypeCost = (rules) => {
        return ProductionCost(rules) * 5;
    }

    const CategoryString = (category, value) => {
        if (category === "Elevation") {
            if (value === "1") return "Low";
            else if (value === "2") return "Mid";
            else if (value === "3") return "High";
        } else if (category === "Blood Type") {
            if (value === "1") return "A";
            else if (value === "2") return "B";
            else if (value === "3") return "O";
        } else {
            return value;
        }
    }

    const FindUnit = (name) => {
        for (var i = 0; i < units.length; ++i) {
            if (units[i].type === name) {
                return units[i].unit;
            }
        }
        return "-";
    }

    const ViewUnit = (name) => {
        if (FindUnit(name) != "-") return FindUnit(name);
    }

    const CheckRule = () => {
        if (ruleType === "None" || ruleMin > ruleMax ||
            (ruleType != "Elevation" && ruleType != "Blood Type" &&
                (ruleMin.length === 0 || ruleMax.length === 0))) {
            alert("Invalid vaccine rule format!");
            return false;
        }
        if (ruleType === "Elevation" && Elevation === 0) {
            alert("Invalid vaccine rule format!");
            return false;
        }
        if (ruleType === "Blood Type" && bloodType === 0) {
            alert("Invalid vaccine rule format!");
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
            max = bloodType;
        } else {
            min = ruleMin;
            max = ruleMax;
        }
        rules.push({num: rules.length + 1, vaccine: nextVaccine, id: testSimId, category: ruleType, range_lower: min, range_upper: max})
        setRules(rules);
        setRuleType("None");
        setRuleMax(0);
        setRuleMin(0);
        setElevation(0);
        setBloodType(0);
    }

    const VaccineConditionsMet = () => {
        if (vaccineName.length === 0) {
            alert("Vaccine prototype requires a name!");
            return false;
        }
        return true;
    }

    const [UIEnabled, setUIEnabled] = useState(true);

    const test = () => {
        setUIEnabled(false);
        const human_num = selected.num;
        Axios.post('http://localhost:3001/api/test', {
            cost: 50,
            simID: testSimId,
            humanID: human_num
        }).then((res) => {
            let new_simulation = {...simulation};
            new_simulation.funds -= 50;
            setSimulation(new_simulation);

            if (Object.entries(res.data[4][0])[0][1] === 'negative') {
                // TELL THE USER THAT THIS PERSON IS NOT INFECTED
                alert('This person is not infected');
            } else {
                let new_infected = {...infected};
                new_infected[human_num.toString()].known = 1;
                setInfected(new_infected);
            }
            setUIEnabled(true);
        })
    };

    const Isolate = () => {
        if (simulation.environment_isolation_capacity === 0) {
            alert("Your environment isolation capacity is full!");
            return;
        }
        setUIEnabled(false);
        const human_num = selected.num;
        Axios.post('http://localhost:3001/api/isolate', {
            cost: 10, 
            simID: testSimId,
            humanID: human_num
        }).then((res) => {
            if (res.data) {
                setUIEnabled(true);
                return;
            }
            let isolatedHuman = simHumans[human_num - 1];
            isolatedHuman.isolated = 1;
            setSimHumans(simHumans.map(human => {return human.num === human_num ? isolatedHuman : human}));
            let updated_isolation_capacity_simulation = simulation;
            --updated_isolation_capacity_simulation.environment_isolation_capacity;
            setSimulation(updated_isolation_capacity_simulation);
            setUIEnabled(true);
        });
    }

    const Unisolate = () => {
        setUIEnabled(false);
        const human_num = selected.num;
        Axios.post('http://localhost:3001/api/unisolate', {
            simID: testSimId,
            humanID: human_num
        }).then((res) => {
            if (res.data) {
                setUIEnabled(true);
                return;
            }
            let unisolatedHuman = simHumans[human_num - 1];
            unisolatedHuman.isolated = 0;
            setSimHumans(simHumans.map(human => {return human.num === human_num ? unisolatedHuman : human}));
            let updated_isolation_capacity_simulation = simulation;
            ++updated_isolation_capacity_simulation.environment_isolation_capacity;
            setSimulation(updated_isolation_capacity_simulation);
            setUIEnabled(true);
        });
    }

    const InsertVaccine = async () => {
        await Axios.post('http://localhost:3001/api/prototype-vaccine', {
            id: testSimId,
            vaccineName: vaccineName
        }).then((res) => {
            setVaccineID(res.data[1][0]['LAST_INSERT_ID()']);
        });
    }

    const InsertRules = async () => {
        for (var i = 0; i < rules.length; ++i) {
            await Axios.post('http://localhost:3001/api/add-vaccine-rule', {
                vaccine: vaccineID,
                id: testSimId,
                category: rules[i].category,
                range_lower: parseInt(rules[i].range_lower),
                range_upper: parseInt(rules[i].range_upper)
            })
        }
    }

    const FindVaccine = (vac) => {
        for (var i = 0; i < vaccines.length; ++i) {
            if (vaccines[i].num == vac) {
                return vaccines[i];
            }
        }
        return null;
    }

    const GetVaccine = async () => {
        Axios.post('http://localhost:3001/api/get-vaccine', {
            id: testSimId
        }).then((response) => {
            setVaccines(response.data);
        });
    }

    const FindVaccineRule = (vac) => {
        for (var i = 0; i < vaccineRules.length; ++i) {
            if (vaccineRules[i].length > 0 && vaccineRules[i][0].vaccine === vac) {
                return vaccineRules[i];
            }
        }
        return null;
    }

    const GetVaccineRules = async () => {
        let new_vaccine_rules = [];
        let promises = [];
        for (let i = 0; i < vaccines.length; ++i) {
            promises.push(Axios.post('http://localhost:3001/api/get-vaccine-rules', {
                id: testSimId,
                vaccine: vaccines[i].num
            }).then((response) => {
                new_vaccine_rules.push(response.data)
            }));
        }
        await Promise.all(promises);
        setVaccineRules(new_vaccine_rules);
    }

    const DeleteVaccine = async (vaccine) => {
        Axios.post('http://localhost:3001/api/delete-vaccine', {
            vaccine: vaccine
        }).then(() => {
            GetVaccine();
        });
    }

    useEffect(() => {
        if (cookies.name == null) {
            navigate("/Login");
        }

        GetVaccineRules();
    }, [vaccines]);

    // useEffect(() => {
    //     vaccines[vaccineRulesRaw.index].rules = [];
    //     for (var i = 0; i < vaccineRulesRaw.values.length; ++i) {
    //         vaccines[vaccineRulesRaw.index].rules.push(vaccineRulesRaw.values[i]);
    //     }
    //     //vaccineRules[vaccineRulesRaw.index] = vals;
    //     setVaccines(vaccines);
    //     //setVaccineRules({vals: vaccineRules}); 
    // }, [vaccineRulesRaw]);  
    
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

    const Prototype = () => {
        InsertVaccine();
    }

    const LoadInfected = () => {
        Axios.post('http://localhost:3001/api/get-infected', {
            simID: testSimId
        }).then((response) => {
            let infected = {};
            response.data.forEach((infection) => {
                infected[infection.human.toString()] = {
                    known: infection.known,
                    infection_time: infection.infection_time,
                    cycles_to_die: infection.cycles_to_die};
            });
            setInfected(infected);
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
        GetVaccine();
        LoadInfected();
    }, []);

    useEffect(() => { 
        InsertRules().then(() => {
            setVaccineName("");
            setRuleType("None");
            setRuleMax(0);
            setRuleMin(0);
            setElevation(0);
            setBloodType(0);
            setRules([]);
            GetVaccine();
        });
    }, [vaccineID]);

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
    let infectedMale = new window.Image();
    infectedMale.src = "res/sick_male.png";
    let infectedFemale = new window.Image();
    infectedFemale.src = "res/sick_female.png";
    let cage = new window.Image();
    cage.src = "res/cage.png";

    /* Assumes human is alive */
    const getHumanIcon = (human_num, gender) => {
        const infected_human = infected[human_num.toString()];
        if (infected_human === undefined) {
            return gender === 'M' ? healthyMale : healthyFemale;
        }

        if (infected_human.known === 1) {
            return gender === 'M' ? infectedMale : infectedFemale;
        }
        const infection_start_time = new Date(infected_human.infection_time);
        const infected_duration = (new Date() - infection_start_time) / 1000;
        const time_to_die_in_seconds = infected_human.cycles_to_die * cycle_length_in_seconds;
        const infection_reveal_threshold = 0.75

        if (infected_duration >= time_to_die_in_seconds * infection_reveal_threshold) {
            return gender === 'M' ? infectedMale : infectedFemale;
        }

        return gender === 'M' ? healthyMale : healthyFemale;
    };

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
                                Age: {selected.age} {ViewUnit("Age")}
                            </label>
                            <label>
                                Weight: {selected.weight} {ViewUnit("Weight")}
                            </label>
                            <label>
                                Height: {selected.height} {ViewUnit("Height")}
                            </label>
                            <label>
                                Blood Type: {selected.blood_type} {ViewUnit("Blood Type")}
                            </label>
                            <label>
                                Blood Pressure: {selected.blood_pressure} {ViewUnit("Blood Pressure")}
                            </label>
                            <label>
                                Cholesterol: {selected.cholesterol} {ViewUnit("Cholesterol")}
                            </label>
                            <label>
                                Radiation: {selected.radiation} {ViewUnit("Radiation")}
                            </label>
                            <label>
                                Fund Rate: ${selected.tax}
                            </label>
                            
                            <button disabled = {simulation.funds < 50 || (infected[selected.num.toString()] !== undefined && infected[selected.num.toString()].known)} onClick={() => {
                                test();
                            }}>
                                Test: $50
                            </button>
                            <button 
                                style = {{border: FindVaccine(selectedVaccine) === null ? "lightgray 2px solid" : "black 2px solid"}}
                                disabled = {FindVaccine(selectedVaccine) === null ? 1 : 0}>
                                Vaccinate{FindVaccine(selectedVaccine) != null ? " " + FindVaccine(selectedVaccine).name : ""}
                            </button>
                            <button disabled={!UIEnabled ? 1 : 0} onClick = {() => {if (selected.isolated) Unisolate(); else Isolate()}}>
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
                                image = {getHumanIcon(datapoint.num, datapoint.gender)}
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
                            <option value="Age">Height</option>
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
                                            <option value={0}>SELECT</option>
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
                                            <option value={0}>SELECT</option>
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
                    <div hidden = {ruleType == "None" ? 1 : 0} className="vaccineRuleOptions">
                        <button onClick = {() => {if (CheckRule()) AddRule();}}>Add Rule</button></div>  

                    <div className = "ruleGroup">
                        {rules.map(datapoint => 
                            <label key = {datapoint.num}>
                                {datapoint.category}: {CategoryString(datapoint.category, datapoint.range_lower + "")} {datapoint.range_upper === datapoint.range_lower ? "" : " - " + datapoint.range_upper} {ViewUnit(datapoint.category)}
                            </label>
                        )}
                    </div>
                    
                    <div hidden = {rules.length > 0 ? 0 : 1} style={{margin: "20px 0px 0px 0px"}}
                        className="vaccineRuleOptions">
                        <button onClick = {() => {if (VaccineConditionsMet()) Prototype();}}>Prototype Vaccine</button></div> 
                
                    <label hidden = {rules.length > 0 ? 0 : 1} style={{fontWeight: "bold", margin: "10px 0px 0px 0px"}}> Prototype Cost: {PrototypeCost(rules)} </label>
                    <label hidden = {rules.length > 0 ? 0 : 1} style={{fontWeight: "bold", margin: "10px 0px 0px 0px"}}> Production Cost: {ProductionCost(rules)} </label>
                </div>
                <div className="actionInfo">
                    <div className = "title" style={{margin: "15px 0px 0px 0px"}}>
                        <label>Vaccine Storage</label>
                    </div>
                    {vaccines.map(datapoint => 
                        <div className = "vaccine" key = {datapoint.num} style = {{backgroundColor: selectedVaccine == datapoint.num ? "lightgray" : "white"}}>
                            <div className="vaccineName">
                                <img src={require('./vaccine.png')} width = "40px" height = "40px" ></img>
                                <label>{datapoint.name}</label>
                                <button onClick = {() => {if (datapoint.num == selectedVaccine) {setSelectedVaccine(0)} DeleteVaccine(datapoint.num)}}>X</button> 
                            </div>
                            {(() => {
                                var rule = FindVaccineRule(datapoint.num);
                                if (rule != null) {
                                    return (
                                        <div className = "vaccineDisplay">
                                            {rule.map(val => 
                                                <label key = {val.num}>
                                                    {val.category}: {CategoryString(val.category, val.range_lower + "")} {val.range_upper === val.range_lower ? "" : " - " + val.range_upper} {ViewUnit(val.category)}
                                                </label>
                                            )}
                                            <label style={{fontWeight: "bold", margin: "10px 0px 0px 0px"}}>
                                                Production Cost: ${ProductionCost(rule)}
                                            </label>
                                            <button style = {{border: selectedVaccine == datapoint.num ? "lightgray 2px solid" : "black 2px solid"}} 
                                                disabled = {selectedVaccine == datapoint.num} onClick={()=>{setSelectedVaccine(datapoint.num)}}>SELECT</button>
                                        </div>
                                    )
                                } 
                            })()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Simulation;