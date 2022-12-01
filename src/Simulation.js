import React, {useState, useEffect, useRef} from "react";
import {Stage, Layer, Circle, Rect, Shape, Image} from "react-konva"
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useCookies } from 'react-cookie';
import { ElevationRange, TemperatureRange, HumidityRange, VaccineTemperatureRange, VaccineHumidityRange } from "./Functions.js"
import { stageWidth, stageHeight, temperatureColors, 
    humidityColors, elevationColors, temperatureRangeMin, temperatureRangeMax, 
    humidityRangeMin, humidityRangeMax, elevationRange, units, cycle_length_in_seconds, gridGap} from "./Constants.js"

// manually calculate total alive maybe?

function Simulation() {
    const windowUrl = window.location.search;
    const params = new URLSearchParams(windowUrl);
    const currUpdate = new Date();
    currUpdate.setTime(currUpdate.getTime() + (5*60*60*1000))

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
    const [infectedData, setInfectedData] = useState([]);
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
    const [plaguesRaw, setPlaguesRaw] = useState([]);
    const [plagues, setPlagues] = useState([]);
    const [selectedVaccine, setSelectedVaccine] = useState(0);

    const ProductionCost = (rules) => {
        var cost = 0;
        for (var i = 0; i < rules.length; ++i) {
            if (rules[i].category === "temperature") {
                cost += (rules[i].range_upper - rules[i].range_lower + 1) * 5;
            } else if (rules[i].category === "humidity") {
                cost += (rules[i].range_upper - rules[i].range_lower + 1) * 5;
            } else if (rules[i].category === "elevation") {
                cost += 100;
            } else if (rules[i].category === "age") {
                cost += (rules[i].range_upper - rules[i].range_lower + 1) * 3;
            } else if (rules[i].category === "weight") {
                cost += (rules[i].range_upper - rules[i].range_lower + 1) * 3;
            } else if (rules[i].category === "blood_type") {
                cost += 100;
            } else if (rules[i].category === "blood_pressure") {
                cost += (rules[i].range_upper - rules[i].range_lower + 1) * 4;
            } else if (rules[i].category === "cholesterol") {
                cost += (rules[i].range_upper - rules[i].range_lower + 1) * 4;
            } else if (rules[i].category === "radiation") {
                cost += (rules[i].range_upper - rules[i].range_lower + 1) * 5;
            }
        }
        return cost;
    }

    const PrototypeCost = (rules) => {
        return ProductionCost(rules) * 5;
    }

    const CategoryString = (category, value) => {
        if (category === "elevation") {
            if (value === "1") return "Low";
            else if (value === "2") return "Mid";
            else if (value === "3") return "High";
        } else if (category === "blood_type") {
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
        if (ruleType === "none" || parseInt(ruleMin) > parseInt(ruleMax) ||
            (ruleType != "elevation" && ruleType != "blood_type" &&
                (ruleMin.length == 0 || ruleMax.length == 0))) {
            alert("Invalid vaccine rule format!");
            return false;
        }
        if (ruleType === "elevation" && Elevation === 0) {
            alert("Invalid vaccine rule format!");
            return false;
        }
        if (ruleType === "blood_type" && bloodType === 0) {
            alert("Invalid vaccine rule format!");
            return false;
        }
        return true;
    }

    const AddRule = () => {
        var min = null, max = null;
        if (ruleType == "elevation") {
            min = Elevation;
            max = Elevation;
        } else if (ruleType == "blood_type") {
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

    const needUpdate = async () => {
        const data = await Axios.post('http://localhost:3001/api/get-last-modified', {
            simID: testSimId
        }).then((response) => {
            const last_updated = new Date(response.data[0].last_modified_time);
            // console.log(last_updated)
            // console.log(currUpdate)
            // console.log(last_updated > currUpdate)
            return (last_updated > currUpdate)
        });
        return data
    }

    const test = () => {
        needUpdate().then(function(result){
            if (result)
            {
                alert("NEED UPDATE")
            }
            else
            {
                setUIEnabled(false);
                const human_num = selected.num;
                Axios.post('http://localhost:3001/api/test', {
                    cost: 0,
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
            }
        })
    };

    const Mark = (option) => {
        needUpdate().then(function(result){
            if (result)
            {
                alert("NEED UPDATE")
            }
            else
            {
                setUIEnabled(false);
                const human_num = selected.num;
                const human = simHumans[human_num - 1];
                if (option === human.mark) return;
                Axios.post('http://localhost:3001/api/mark', {
                    simID: testSimId,
                    humanID: human_num,
                    mark: option
                }).then(() => {
                    let new_sim_humans = [...simHumans];
                    new_sim_humans[human_num - 1].mark = option;
                    setSimHumans(new_sim_humans);
                    setSelected(new_sim_humans[human_num - 1]);
                    setUIEnabled(true);
                })
            }
        })
    }

    const Isolate = () => {
        needUpdate().then(function(result){
            if (result)
            {
                alert("NEED UPDATE")
            }
            else
            {
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
                    let new_sim_humans = [...simHumans];
                    new_sim_humans[human_num - 1].isolated = 1;
                    setSimHumans(new_sim_humans);
                    let updated_isolation_capacity_simulation = simulation;
                    --updated_isolation_capacity_simulation.environment_isolation_capacity;
                    setSimulation(updated_isolation_capacity_simulation);
                    setSelected(new_sim_humans[human_num - 1]);
                    setUIEnabled(true);
                });
            }
        })
    }

    const Unisolate = () => {
        needUpdate().then(function(result){
            if (result)
            {
                alert("NEED UPDATE")
            }
            else
            {
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
                    let new_sim_humans = [...simHumans];
                    new_sim_humans[human_num - 1].isolated = 0;
                    setSimHumans(new_sim_humans);
                    let updated_isolation_capacity_simulation = simulation;
                    ++updated_isolation_capacity_simulation.environment_isolation_capacity;
                    setSimulation(updated_isolation_capacity_simulation);
                    setSelected(new_sim_humans[human_num - 1]);
                    setUIEnabled(true);
                });
            }
        })
    }

    const killHuman = async (human_num) => {
        needUpdate().then(function(result){
            if (result) {
                alert("NEED UPDATE")
            } else {
                Axios.post('http://localhost:3001/api/kill-human', {
                    simID: testSimId,
                    humanID: human_num
                }).then((res) => {
                    if (res.data) return;
                    let new_simulation = {...simulation};
                    new_simulation.num_deceased++;
                    setSimulation(new_simulation);
                    let new_sim_humans = [...simHumans];
                    new_sim_humans[human_num - 1].status = 'dead';
                    setSimHumans(new_sim_humans);
                    let new_infected = {...infected};
                    delete new_infected[human_num.toString()];
                    setInfected(new_infected);
                });
            }
        })
    };

    const cureHuman = async (human_num) => {
        needUpdate().then(function(result){
            if (result) {
                alert("NEED UPDATE")
            } else {
                Axios.post('http://localhost:3001/api/cure-human', {
                    simID: testSimId,
                    humanID: human_num
                }).then((res) => {
                    if (res.data) return;
                    let new_infected = {...infected};
                    delete new_infected[human_num.toString()];
                    setInfected(new_infected);
                });
            }
        })
    };

    const InsertVaccine = () => {
        needUpdate().then(function(result){
            if (result)
            {
                alert("NEED UPDATE")
            }
            else
            {
                Axios.post('http://localhost:3001/api/prototype-vaccine', {
                    id: testSimId,
                    vaccineName: vaccineName
                }).then((res) => {
                    setVaccineID(res.data[1][0]['LAST_INSERT_ID()']);
                });
            }
        })
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
            setVaccinesRaw(response.data);
        });
    }

    const GetVaccineRules = async () => {
        let newVaccines = [];
        let promises = [];
        for (let i = 0; i < vaccinesRaw.length; ++i) {
            promises.push(Axios.post('http://localhost:3001/api/get-vaccine-rules', {
                id: testSimId,
                vaccine: vaccinesRaw[i].num
            }).then((response) => {
                vaccinesRaw[i].rules = response.data;
                newVaccines.push(vaccinesRaw[i])
            }));
        }
        await Promise.all(promises);
        setVaccines(newVaccines);
    }

    useEffect(() => {
        if (cookies.name == null) {
            navigate("/Login");
        }
        GetVaccineRules();
    }, [vaccinesRaw]);

    const DeleteVaccine = async (vaccine) => {
        needUpdate().then(function(result){
            if (result)
            {
                alert("NEED UPDATE")
            }
            else
            {
                Axios.post('http://localhost:3001/api/delete-vaccine', {
                    vaccine: vaccine
                }).then(() => {
                    GetVaccine();
                });
            }
        })
    }

    const GetPlague = async () => {
        Axios.post('http://localhost:3001/api/get-plague', {
            id: testSimId
        }).then((response) => {
            setPlaguesRaw(response.data);
        });
    }

    const GetPlagueRules = async () => {
        let newPlagues = [];
        let promises = [];
        for (let i = 0; i < plaguesRaw.length; ++i) {  
            promises.push(Axios.post('http://localhost:3001/api/get-plague-rules', {
                id: testSimId,
                variant: plaguesRaw[i].variant
            }).then((response) => {
                plaguesRaw[i].rules = response.data;
                newPlagues.push(plaguesRaw[i])
            }));
        }
        
        await Promise.all(promises);
        setPlagues(newPlagues);
    }

    useEffect(() => {
        if (cookies.name == null) {
            navigate("/Login");
        }
        GetPlagueRules();
    }, [plaguesRaw]);
    
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
            var arr = response.data;
            setSimHumans(arr);
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
                    human: infection.human,
                    variant: infection.plague_id,
                    known: infection.known,
                    infection_time: infection.infection_time,
                    cycles_to_die: infection.cycles_to_die};
            });
            setInfected(infected);
            setInfectedData(response.data);
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
        GetPlague();
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

    const Vaccinate = (target) => {  
        if (selectedVaccine == 0) alert("No vaccine selected!");
        
        var infectionInfo = null;
        for (var i = 0; i < infectedData.length; ++i) {
            if (infectedData[i].human == target.num) {
                infectionInfo = infectedData[i];
            }
        }
        if (infectionInfo == null) {
            killHuman(target.num);
            console.log("random 1");
        } else {
            var vaccineRules = [];
            for (var i = 0; i < vaccines.length; ++i) {
                if (vaccines[i].num == selectedVaccine) {
                    vaccineRules = vaccines[i].rules
                }
            }
            var plagueRules = [];
            for (var i = 0; i < plagues.length; ++i) {
                if (plagues[i].variant == infectionInfo.plague) {
                    plagueRules = plagues[i].rules;
                }
            }
            var hit = 0;
            for (var i = 0; i < plagueRules.length; ++i) {
                for (var j = 0; j < vaccineRules.length; ++j) {
                    if (plagueRules[i].category == vaccineRules[j].category) {
                        var val = 0;
                        if (plagueRules[i].category == "temperature") val = TemperatureRange(target.y);
                        else if (plagueRules[i].category == "humidity") val = HumidityRange(target.x);
                        else if (plagueRules[i].category == "elevation") val = ElevationRange(target.x, target.y);
                        else if (plagueRules[i].category == "age") val = target.age;
                        else if (plagueRules[i].category == "weight") val = target.weight;
                        else if (plagueRules[i].category == "height") val = target.height;
                        else if (plagueRules[i].category == "blood_type") val = target.blood_type;
                        else if (plagueRules[i].category == "blood_pressure") val = target.blood_pressure;
                        else if (plagueRules[i].category == "cholesterol") val = target.cholesterol;
                        else if (plagueRules[i].category == "radiation") val = target.radiation;
                        if (vaccineRules[j].category == "temperature") {
                            var tempRange = VaccineTemperatureRange(vaccineRules[j].range_lower, vaccineRules[j].range_upper);
                            console.log(tempRange);
                            if (tempRange[0] <= val && tempRange[1] >= val) {
                                hit += 2;
                                break;
                            }
                        } else if (vaccineRules[j].category == "humidity") {
                            var humidRange = VaccineHumidityRange(vaccineRules[j].range_lower, vaccineRules[j].range_upper);
                            console.log(humidRange);
                            if (humidRange[0] <= val && humidRange[1] >= val) {
                                hit += 2;
                                break;
                            }
                        } else {
                            if (vaccineRules[j].range_lower <= val && vaccineRules[j].range_upper >= val) {
                                hit += 2;
                                break;
                            }
                        }
                    } 
                }
            }
            if (hit == plagueRules.length + vaccineRules.length) {
                console.log("cure");
                
            } else {
                // killHuman(target.num);
                console.log("random 2");
            }
        }
    }

    const Catalog = () => {
        var cyclesElapsed = getNumberOfElapsedCyclesToNow(simulation.last_background_update_time, cycle_length_in_seconds);
        // var collectedFunds = 0;
        // for (var i = 0; i < cyclesElapsed; ++i) {
        //     for (var j = j < simHumans.length; ++j) {
        //         if (simHumans[j].isolated == 0 && simHumans[j].status === "alive") {
        //             collectedFunds += simHumans[j].funds;
        //         }
        //     }
        //     // collect tax each cycle
        //     // update status

        //     // attempt to spread by chance

        //     // if none infected, attempt to mutate
        // }
    }

    let healthyMale = new window.Image();
    healthyMale.src = "res/healthy_male.png"; 
    let healthyFemale = new window.Image();
    healthyFemale.src = "res/healthy_female.png";
    let infectedMale = new window.Image();
    infectedMale.src = "res/sick_male.png";
    let infectedFemale = new window.Image();
    infectedFemale.src = "res/sick_female.png";
    let deadMale = new window.Image();
    deadMale.src = "res/dead_male.png";
    let deadFemale = new window.Image();
    deadFemale.src = "res/dead_female.png";
    let cage = new window.Image();
    cage.src = "res/cage.png";
    let factory = new window.Image();
    factory.src = "res/radiation.png";

    /* Gender is either 'M' or 'F' */
    const getHumanIcon = (human_num, gender) => {
        const human = simHumans[human_num - 1];
        if (human.status === 'dead') {
            return gender === 'M' ? deadMale : deadFemale;
        }

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
                    {selected != null && selected.description != null && 
                        <div className = "selectedInfo">
                            <div className = "title">
                                <label>
                                    {selected.name}
                                </label>
                            </div>
                            <label>
                                Radiation Source
                            </label>
                            <img src = {require('./radiation.png')} width = "150px" height = "150px">
                            </img>
                            <label></label>
                            <label>
                                {selected.description}
                            </label>
                        </div>
                    }
                    {selected != null && selected.age != null && 
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
                            
                            <button disabled = {!UIEnabled || simulation.funds < 50 || (infected[selected.num.toString()] !== undefined && infected[selected.num.toString()].known)} onClick={() => {
                                test();
                            }} style = {{border: !UIEnabled ? "lightgray 2px solid" : "black 2px solid"}}>
                                Test: $50
                            </button>
                            <button onClick={() => {Vaccinate(selected)}}
                                style = {{border: FindVaccine(selectedVaccine) === null || !UIEnabled ? "lightgray 2px solid" : "black 2px solid"}}
                                disabled = {FindVaccine(selectedVaccine) === null || !UIEnabled ? 1 : 0}>
                                Vaccinate{FindVaccine(selectedVaccine) != null ? " " + FindVaccine(selectedVaccine).name : ""}
                            </button>
                            <button disabled={!UIEnabled ? 1 : 0} onClick = {() => {if (selected.isolated) Unisolate(); else Isolate()}}
                                    style = {{border: !UIEnabled ? "lightgray 2px solid" : "black 2px solid"}}>
                                {selected.isolated ? "Unisolate" : "Isolate"}
                            </button>
                            <div className = "mark">
                                <label style={{ color: !UIEnabled ? "lightgray" : "black" }}>
                                    Mark:
                                </label>
                                <button style={{backgroundColor: "white", border: !UIEnabled ? "lightgray 2px solid" : "black 2px solid",
                                    width: selected.mark == null ? "30px" : "20px",
                                    height: selected.mark == null ? "30px" : "20px",
                                    borderRadius: selected.mark == null ? "15px" : "10px"}}
                                    onClick = {() => { Mark(null); }}
                                    disabled = {!UIEnabled}></button>
                                <button style={{backgroundColor: "yellow", border: !UIEnabled ? "lightgray 2px solid" : "black 2px solid", 
                                    width: selected.mark === 1 ? "30px" : "20px",
                                    height: selected.mark === 1 ? "30px" : "20px",
                                    borderRadius: selected.mark === 1 ? "15px" : "10px"}}
                                    onClick = {() => { Mark(1); }}
                                    disabled = {!UIEnabled}></button>
                                <button style={{backgroundColor: "orange", border: !UIEnabled ? "lightgray 2px solid" : "black 2px solid", 
                                    width: selected.mark === 2 ? "30px" : "20px",
                                    height: selected.mark === 2 ? "30px" : "20px",
                                    borderRadius: selected.mark === 2 ? "15px" : "10px"}}
                                    onClick = {() => { Mark(2); }}
                                    disabled = {!UIEnabled}></button>
                                <button style={{backgroundColor: "red", border: !UIEnabled ? "lightgray 2px solid" : "black 2px solid", 
                                    width: selected.mark === 3 ? "30px" : "20px",
                                    height: selected.mark === 3 ? "30px" : "20px",
                                    borderRadius: selected.mark === 3 ? "15px" : "10px"}}
                                    onClick = {() => { Mark(3); }}
                                    disabled = {!UIEnabled}></button>
                                <button style={{backgroundColor: "crimson", border: !UIEnabled ? "lightgray 2px solid" : "black 2px solid", 
                                    width: selected.mark === 4 ? "30px" : "20px",
                                    height: selected.mark === 4 ? "30px" : "20px",
                                    borderRadius: selected.mark === 4 ? "15px" : "10px"}}
                                    onClick = {() => { Mark(4); }}
                                    disabled = {!UIEnabled}></button>
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
                                strokeWidth = {datapoint.mark == null ? 0 : 5}
                                stroke = {datapoint.mark == null ? "black" : datapoint.mark === 1 ? "yellow" : datapoint.mark == 2 ? "orange" : datapoint.mark === 3 ? "red" : "crimson"}>
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
                            radius = {selected != null && selected.description != null ? 80 : 30}
                            strokeWidth = {selected === null ? 0 : 4}
                            stroke = "black">
                        </Circle>
                        <Image 
                            x = {simulation.factoryX - 25 - 50}
                            y = {simulation.factoryY - 25 - 50}
                            width = {50 * 3}
                            height = {50 * 3}
                            image = {factory}
                            onClick = {() => {
                                setSelected({name: "Factory", description: "The factory might be leaking... Individuals close to the factory might experience higher dosage of radiation...", 
                                    x: simulation.factoryX, y: simulation.factoryY})
                            }}>
                        </Image>
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
                            <option value="none">Select Rule</option>
                            <option value="temperature">Temperature</option>
                            <option value="humidity">Humidity</option>
                            <option value="elevation">Elevation</option>
                            <option value="age">Age</option>
                            <option value="height">Height</option>
                            <option value="weight">Weight</option>
                            <option value="blood_type">Blood Type</option>
                            <option value="blood_pressure">Blood Pressure</option>
                            <option value="cholesterol">Cholesterol</option>
                            <option value="radiation">Radiation</option>
                        </select>
                        <label>
                            {ruleType === "None" ? "UNIT" : FindUnit(ruleType)}
                        </label>
                    </div>

                    <div className = "ruleCategory" hidden = {ruleType == "None" ? 1 : 0}>
                        <label style={{margin: "0px 0px 0px 0px", fontWeight: "bold"}}>{ruleType == "blood_type" ? 
                            "Type" : ruleType == "elevation" ? "Ground Level" : "Range"}</label></div>

                    <div className = "vaccineRules" hidden = {ruleType == "None" ? 1 : 0}>
                        {(() => {
                            if (ruleType == "blood_type") {
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
                            } else if (ruleType == "elevation") {
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
                                var rule = datapoint.rules;
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