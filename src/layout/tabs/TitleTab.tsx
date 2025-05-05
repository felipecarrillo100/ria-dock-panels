import React from "react";
import type {IDockviewPanelHeaderProps} from "dockview-react";

export const TitleTab: React.FC<IDockviewPanelHeaderProps> = (props) => {
    return (
        <div style={{display: 'flex', alignItems: 'center'}} className="dv-default-tab">
            <div className="dv-default-tab-content">{props.api.title}</div>
            {/* No close button here, so it can't be closed */}
        </div>
    );
};

