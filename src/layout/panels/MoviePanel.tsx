import React, {useEffect, useState} from "react";
import type {IDockviewPanelProps} from "dockview-react";

export const MoviePanel: React.FC<IDockviewPanelProps> = ()=> {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        // Cleanup the interval on component unmount
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{ padding: '10px' }}>
            <h1>Current Time</h1>
            <p>{time.toLocaleTimeString()}</p>
        </div>
    );
}
