import React from 'react';
import { useNavigate } from "react-router-dom";

const SimulationButton = (props) =>{
    const navigate = useNavigate();

    return (
        <div className="scroll-pane-object">
            <div className = "sim-box">
                <label style={{
                    fontSize: '25px', padding: '10px', 
                    fontWeight: 'bold',textAlign: 'center'}}>
                        {props.title}</label>
                <button onClick={() => navigate("/SimInfo?id=" + props.id)}>select</button>
            </div>
        </div>
    );
}

export default SimulationButton;