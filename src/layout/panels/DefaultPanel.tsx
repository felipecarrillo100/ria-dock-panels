import React from "react";
import type {IDockviewPanelProps} from "dockview-react";
import {LayerTreeView} from "../../components/LayerTreeView/LayerTreeView.tsx";

export const DefaultPanel: React.FC<IDockviewPanelProps> = ({ api })=> {
    const treeData = {
        name: 'Root',
        children: [
            {
                name: 'Child 1',
                children: [
                    { name: 'Grandchild 1.1' },
                    { name: 'Grandchild 1.2' },
                    { name: 'Grandchild 1.3' },
                    { name: 'Grandchild 1.4', children: [
                                    { name: 'Grandchild A.1' },
                                    { name: 'Grandchild A.2' },
                                    { name: 'Grandchild A.3' },
                                    { name: 'Grandchild A.4' },
                                ],
                             },
                ],
            },
            {
                name: 'Child 2',
                children: [
                    { name: 'Grandchild 2.1' },
                    { name: 'Grandchild 2.2' },
                    { name: 'Grandchild 2.3' },
                    { name: 'Grandchild 2.5' },
                ],
            },
        ],
    };


    return (
        <div style={{ width: "100%", height: "100%", margin: 4, padding: 6, overflowY: "scroll" }}>
            <LayerTreeView data={treeData} />
        </div>
    );
}
