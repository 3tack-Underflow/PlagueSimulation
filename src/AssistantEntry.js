const AssistantEntry = (props) =>{
    return (
        <div className = "assistant-entry">
            <label className = "assistant-entry-title"> 
                {props.title}
            </label> 
            <button onClick={() => {props.command(props.title)}}>X</button>
        </div>
    );
}

export default AssistantEntry;