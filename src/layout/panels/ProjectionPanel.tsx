import React, {useEffect, useState} from "react";
import type {IDockviewPanelProps} from "dockview-react";
import {useComService} from "../../providers/ComServiceProvider.tsx";
import {UIActions} from "../../interfaces/UIActions.ts";

export const ProjectionPanel: React.FC<IDockviewPanelProps> = ()=> {
    const {setCommand, mainMap} = useComService();
    const [reference, setReference] = useState("");

    const setProjection = (epsg: string) =>() =>{
        setCommand({action: UIActions.SetProjection, parameters: {projection: epsg}})
    };

    useEffect(() => {
        if (!mainMap) return;
        setReference(mainMap.reference.identifier)
        mainMap.on("ReferenceChanged", ()=>{
            setReference(mainMap.reference.identifier);
        })
    }, [mainMap]);

    return (
        <div style={{ width: "100%", height: "100%" }}>
            { (reference === "EPSG:4978") ?
                <button onClick={setProjection("EPSG:3857")}>2d</button> :
                <button onClick={setProjection("EPSG:4978")}>3d</button>
            }
        </div>
    );
}
