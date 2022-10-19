const SimulationButton = (props) =>{
    return (
        <div className="scroll-pane-object">
            <div className = "sim-box">
                <label style={{
                    fontSize: '25px', padding: '10px', 
                    fontWeight: 'bold',textAlign: 'center'}}>
                        The Black Death part 2</label>
                <button onClick={() => {props.command()}}>select</button>
            </div>
        </div>
    );
}

export default SimulationButton;