import React, {useEffect, useRef, useState} from 'react';
import './LayerTreeView.scss';
import {useComService} from "../../providers/ComServiceProvider.tsx";
import type {LayerTree} from "@luciad/ria/view/LayerTree.js";
import {LayerTreeNode} from "@luciad/ria/view/LayerTreeNode.js";
import type {WebGLMap} from "@luciad/ria/view/WebGLMap.js";
import type {Handle} from "@luciad/ria/util/Evented.js";
import {LayerTreeVisitor} from "@luciad/ria/view/LayerTreeVisitor.js";
import type {Layer} from "@luciad/ria/view/Layer.js";
import type {LayerGroup} from "@luciad/ria/view/LayerGroup.js";


interface Handles {
    added: Handle | null;
    removed: Handle | null;
    moved: Handle | null;
}

interface LayerTreeStatic {
    id: string;
    visible: boolean;
    label: string;
    children: LayerTreeStatic[];
    type: "Layer" | "LayerGroup";
}

export const LayerTreeView: React.FC = () => {
    // Render the tree, starting from the children of the root node
    const {mainMap} = useComService();
    const [layerTree, setLayerTree] = useState(null as  LayerTreeStatic | null);

    const myMap = useRef(null as WebGLMap | null);

    const handlers = useRef({added: null} as Handles);

    useEffect(() => {
        if (!mainMap) return;
        if (myMap.current !== null) {
            if (handlers.current.added) handlers.current.added.remove();
            if (handlers.current.removed) handlers.current.removed.remove();
            if (handlers.current.moved) handlers.current.moved.remove();
        }
        myMap.current = mainMap
        handlers.current.removed = mainMap.layerTree.on("NodeRemoved", layerChanged);
        handlers.current.moved = mainMap.layerTree.on("NodeMoved", layerChanged);
        handlers.current.added = mainMap.layerTree.on("NodeAdded", layerChanged);
    }, [mainMap]);

    const layerChanged = ()=>{
        if (mainMap) {
            const layerTreeStatic = generateLayerTreeStatic(mainMap.layerTree)
            setLayerTree(layerTreeStatic);
        }
    }

    const generateLayerTreeStatic = (layerTree: LayerTree) => {
        const layerTreeStatic: LayerTreeStatic = {
            id: layerTree.id,
            label: layerTree.label,
            visible: layerTree.visible,
            children: []
        };

        const layerTreeVisitor: LayerTreeVisitor = {
            visitLayer: (layer: Layer): LayerTreeVisitor.ReturnValue => {
                const parent = findNodeById(layerTreeStatic, layer.parent!.id);
                const newGroup: LayerTreeStatic = {
                    id: layer.id,
                    label: layer.label,
                    visible: layer.visible,
                    children: [],
                    type: "Layer"
                }
                parent?.children.push(newGroup);
                return LayerTreeVisitor.ReturnValue.CONTINUE;
            },
            visitLayerGroup(layerGroup: LayerGroup): LayerTreeVisitor.ReturnValue {
                const parent = findNodeById(layerTreeStatic, layerGroup.parent!.id);
                const newGroup: LayerTreeStatic = {
                    id: layerGroup.id,
                    label: layerGroup.label,
                    visible: layerGroup.visible,
                    children: [],
                    type: "LayerGroup"
                }
                parent?.children.push(newGroup);
                layerGroup.visitChildren(layerTreeVisitor, LayerTreeNode.VisitOrder.TOP_DOWN);
                return LayerTreeVisitor.ReturnValue.CONTINUE;
            }
        };
        layerTree.visitChildren(layerTreeVisitor, LayerTreeNode.VisitOrder.TOP_DOWN);
        return layerTreeStatic;
    }

    if (!layerTree) return <div className="tree"/>
    return (
        <div className="tree">
            {layerTree.children && layerTree.children.map((child, index) => (
                <TreeNodeComponent key={index} node={child} />
            ))}
        </div>
    );
};

const TreeNodeComponent: React.FC<{ node: LayerTreeStatic }> = ({ node }) => {
    const [visible, setVisible] = useState(node.visible);
    const {mainMap} = useComService();

    const toggleVisible = () => {
        if (mainMap) {
            const realNode = mainMap.layerTree.findLayerTreeNodeById(node.id);
            realNode.visible = !visible;
            setVisible(!visible);
        }
    }
    const zoomToLayer = () => {
        if (mainMap) {
            const realNode = mainMap.layerTree.findLayerById(node.id);
            if (realNode) {
                if (realNode.bounds) mainMap.mapNavigator.fit({bounds: realNode.bounds, animate: true});
            }
        }
    }
    const removeLayer = () => {
        if (mainMap) {
            const realNode = mainMap.layerTree.findLayerTreeNodeById(node.id);
            if (realNode) {
                const parent = realNode.parent;
                parent?.removeChild(realNode);
            }
        }
    }

    return (
        <div className="tree-node">
            <div className="node-content">
                <span className="node-icon-left">{node.type==="Layer" ? '🌿' : '📁'}</span> {/* Example left icon */}
                <span className="node-name">{node.label}</span>
                <div className="node-icons-right">
                    <span className="node-icon" onClick={removeLayer}>🗑️️</span> {/* Example right icon 3 */}
                    <span className="node-icon" onClick={zoomToLayer}>🔍</span> {/* Example right icon 2 */}
                    <span className="node-icon" onClick={toggleVisible}>{visible ? '👁️' : '🙈'} </span> {/* Changed to eye icon */}
                </div>
            </div>
            {node.children && (
                <div className="node-children">
                    {node.children.map((child:LayerTreeStatic, index: number) => (
                        <TreeNodeComponent key={index} node={child} />
                    ))}
                </div>
            )}
        </div>
    );
};

function findNodeById(tree: LayerTreeStatic, id: string): LayerTreeStatic | null {
    // Check if the current node matches the id
    if (tree.id === id) {
        return tree;
    }

    // Recursively search in the children
    for (const child of tree.children) {
        const result = findNodeById(child, id);
        if (result !== null) {
            return result;
        }
    }

    // Return null if no matching node is found
    return null;
}
