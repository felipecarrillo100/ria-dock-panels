import React, {useEffect, useState} from 'react';
import {
    DockviewReact,
    DockviewApi,
    type DockviewReadyEvent,
} from 'dockview-react';

import {DefaultLayout} from "../../layout/DefaultLayout.ts";
import {type DroptargetOverlayModel} from "dockview-core/dist/cjs/dnd/droptarget";
import {TitleTab} from "../../layout/tabs/TitleTab.tsx";
import {PanelComponents} from "../../layout/PanelComponents.ts";


export const Workspace: React.FC = () => {
    const [api, setApi] = useState(null as DockviewApi | null);

    const onReady = (event: DockviewReadyEvent)=> {
        if (event.api) {
            let success = false;
            const layoutString = localStorage.getItem(
                'dockview_persistence_layout'
            );

            if (layoutString) {
                try {
                    const layout = JSON.parse(layoutString);
                    event.api.fromJSON(layout);
                    success = true;
                } catch (err) {
                    console.error(err);
                }
            }

            if (!success) {
                event.api.fromJSON(DefaultLayout);
            }
        }
        setApi(event.api);
    };

    useEffect(() => {
        if (!api) {
            return;
        }

        api.onDidLayoutChange(() => {
            const layout = api.toJSON();

            localStorage.setItem(
                'dockview_persistence_layout',
                JSON.stringify(layout)
            );
        });
    }, [api]);

    const dndEdges: DroptargetOverlayModel = {
        size: {value: 0, type: "percentage"},
        activationSize: {value: 0, type: "percentage"}
    }

    return (
        <div style={{height: '100vh'}}>
            <DockviewReact
                components={PanelComponents}
                tabComponents={{
                    "no-close": TitleTab, // 👈 this one has no close button
                }}
                onReady={onReady}
                locked={false}
                dndEdges={dndEdges}
                disableDnd={false}
            />
        </div>
    );
}

