import React from 'react';
import {Circle} from "react-konva"

const SimulationHuman = (props) =>{
    return (
        <Circle>
            x = {props.x}
            y = {props.y}
            radius = {10}
            fill = "#000000"
        </Circle>
    );
}

export default SimulationHuman;