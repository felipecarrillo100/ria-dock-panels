import React, {createContext, useState, type ReactNode, useContext, type Dispatch, type SetStateAction} from 'react';
import type {UICommand} from "../interfaces/UICommand.ts";
import type {WebGLMap} from "@luciad/ria/view/WebGLMap.js";

// Define the shape of the context value
interface ComServiceProviderType {
    // Commands
    command: UICommand | null; // You can replace `any` with a more specific type if you know the structure of your data
    setCommand: (a: UICommand | null) => void;
    // Main map
    mainMap: WebGLMap | null;
    setMainMap: Dispatch<SetStateAction<WebGLMap | null>>;
}

// Create a Context for the service with a default value
const ComServiceContext = createContext<ComServiceProviderType|undefined>(undefined);

// Define the props for the provider component
interface ComServiceproviderProps {
    children: ReactNode;
}

// Create a Provider component
export const ComServiceprovider: React.FC<ComServiceproviderProps> = ({ children }) => {
    const [command, setCommand] = useState( null as UICommand | null ); // Replace `any` with a more specific type if possible
    const [mainMap, setMainMap] = useState( null as WebGLMap | null ); // Replace `any` with a more specific type if possible

    const updateCommand = (newCommand: UICommand | null) => {
        setCommand(newCommand);
    }

    return (
        <ComServiceContext.Provider value={{ command, setCommand: updateCommand, mainMap, setMainMap }}>
            {children}
        </ComServiceContext.Provider>
    );
};

// Custom hook to use the service
export const useComService = () => {
    return useContext(ComServiceContext) as  ComServiceProviderType;
};
