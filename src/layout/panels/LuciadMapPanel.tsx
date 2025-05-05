import React from "react";
import type {IDockviewPanelProps} from "dockview-react";
import {LuciadMap} from "../../components/LuciadMap/LuciadMap.tsx";

export const LuciadMapPanel: React.FC<IDockviewPanelProps> = ()=> {
    return (
        <div style={{ width: "100%", height: "100%" }}>
            <LuciadMap />
        </div>
    );
}
