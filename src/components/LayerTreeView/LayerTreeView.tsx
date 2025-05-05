import React from 'react';
import './LayerTreeView.scss';

interface TreeNode {
    name: string;
    children?: TreeNode[];
}

interface TreeProps {
    data: TreeNode;
}

export const LayerTreeView: React.FC<TreeProps> = ({ data }) => {
    // Render the tree, starting from the children of the root node
    return (
        <div className="tree">
            {data.children && data.children.map((child, index) => (
                <TreeNodeComponent key={index} node={child} />
            ))}
        </div>
    );
};

const TreeNodeComponent: React.FC<{ node: TreeNode }> = ({ node }) => {
    const isVisible = false;
    return (
        <div className="tree-node">
            <div className="node-content">
                <span className="node-icon-left">🌿</span> {/* Example left icon */}
                <span className="node-name">{node.name}</span>
                <div className="node-icons-right">
                    <span className="node-icon">⚙️</span> {/* Example right icon 3 */}
                    <span className="node-icon">🔍</span> {/* Example right icon 2 */}
                    <span className="node-icon">{isVisible ? '👁️' : '🙈'} </span> {/* Changed to eye icon */}
                </div>
            </div>
            {node.children && (
                <div className="node-children">
                    {node.children.map((child, index) => (
                        <TreeNodeComponent key={index} node={child} />
                    ))}
                </div>
            )}
        </div>
    );
};
