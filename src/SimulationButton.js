import React from 'react';

const SimulationButton = (props) =>{
    return (
        <div className="scroll-pane-object">
            <div className = "sim-box">
                <label style={{
                    fontSize: '25px', padding: '10px', 
                    fontWeight: 'bold',textAlign: 'center'}}>
                        {props.title}</label>
                {<button onClick={() => {}}>select</button>}
            </div>
        </div>
    );
}

export default SimulationButton;