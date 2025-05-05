import React from 'react';
import './App.css'
import {Workspace} from "./components/Workspace/Workspace.tsx";
import {ComServiceprovider} from "./providers/ComServiceProvider.tsx";

export const App: React.FC = () => {

    return (
        <div style={{height: '100vh'}}>
            <ComServiceprovider>
                <Workspace />
            </ComServiceprovider>
        </div>
    );
}

