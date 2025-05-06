import React from "react";
import type {IDockviewPanelProps} from "dockview-react";
import {LayerTreeView} from "../../components/LayerTreeView/LayerTreeView.tsx";

export const DefaultPanel: React.FC<IDockviewPanelProps> = ()=> {
    return (
        <div style={{ width: "100%", height: "100%", margin: 4, padding: 6, overflowY: "scroll" }}>
            <LayerTreeView />
        </div>
    );
}
