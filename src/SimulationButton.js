const SimulationButton = (props) =>{
    return (
        <div className="scroll-pane-object">
            <label className="simulation-button-title">{props.title}</label>
            <button onClick={() => {props.command()}}>123</button>
        </div>
    );
}

export default SimulationButton;