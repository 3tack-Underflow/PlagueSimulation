import React, {useState, useEffect} from "react";
import {Stage, Layer, Circle} from "react-konva"

function Simulation() {
    const [size, setSize] = useState({ 
        width: window.innerWidth, 
        height: window.innerHeight 
    });
    const [simHumans, setSimHumans] = useState([
        {key: 0, x: 100, y: 100, name: "George Duan"}, 
        {key: 1, x: 400, y: 400, name: "CBC Duan"}, 
        {key: 2, x: 150, y: 150, name: "ABC Duan"}, 
        {key: 3, x: 200, y: 300, name: "Alan McRoblox"}, 
        {key: 4, x: 500, y: 200, name: "George Duan"}]);
    const [selected, setSelected] = useState{

    }

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

    return (
        <div className = "Simulation">
            <div className = "locationMap">
                <Stage
                    width = {size.width}
                    height = {size.height}
                    draggable = {true}
                >
                    <Layer>
                        {simHumans.map(datapoint => 
                            <Circle
                                key = {datapoint.key}
                                x = {datapoint.x}
                                y = {datapoint.y}
                                radius = {10}
                                fill = "#000000"
                                onClick={
                                    (e) => {
                                        const emptySpace = e.target === e.target;
                                        if (!emptySpace) {
                                        return;
                                        }

                                        console.log("pressed " + datapoint.x + " " + datapoint.y)
                                    }
                                }
                            ></Circle>
                        )}
                    </Layer>
                </Stage>
            </div>
            <div className = "infoPane">
                
            </div>
        </div>
    );
}

export default Simulation;