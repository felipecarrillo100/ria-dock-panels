import React, {useEffect, useRef} from "react";
import {WebGLMap} from "@luciad/ria/view/WebGLMap.js";
import {getReference} from "@luciad/ria/reference/ReferenceProvider.js";
import "./LuciadMap.scss";
import {useComService} from "../../providers/ComServiceProvider.tsx";
import {UIActions} from "../../interfaces/UIActions.ts";
import type {UICommand} from "../../interfaces/UICommand.ts";
import {UILayerTypes} from "../../modules/luciad/interfaces/UILayerTypes.ts";
import {CreateNewLayer} from "../../modules/luciad/factories/CreateNewLayer.ts";
import {Layer} from "@luciad/ria/view/Layer.js";
import type {LayerGroup} from "@luciad/ria/view/LayerGroup.js";

export const LuciadMap: React.FC = () => {
    const divElement = useRef(null as null | HTMLDivElement);
    const nativeMap = useRef(null as null | WebGLMap);

    const {setMainMap, command} = useComService();

    useEffect(()=>{
        // Initialize Map
        if (divElement.current!==null) {
            nativeMap.current = new WebGLMap(divElement.current, {reference: getReference("EPSG:4978")});
            setMainMap(nativeMap.current);
            initialize();
        }
        return ()=>{
            // Destroy map
            if (nativeMap.current) nativeMap.current.destroy();
        }
    }, []);

    const initialize = async () => {
        await createAnyLayer(BingmapsCommand);
    }

    const setProjection = (command: UICommand) => {
        if (nativeMap.current) {
            nativeMap.current.reference = getReference(command.parameters.projection);
        }
    };

    useEffect(() => {
        if (!command) return;
        switch (command.action) {
            case UIActions.CreateAnyLayer:
                createAnyLayer(command);
                return;
            case UIActions.SetProjection:
                setProjection(command);
                return;
            case UIActions.IncrementCounter:
                console.log(command);
                break;
        }
    }, [command]);
    const createAnyLayer = async (newCommand: UICommand) => {
        const node = await CreateNewLayer(newCommand.parameters);
        if (nativeMap.current) {
            nativeMap.current.layerTree.addChild(node);
            if (node instanceof Layer ) {
                const layer = node as Layer | LayerGroup;
                if (layer instanceof Layer ) {
                    if (newCommand.parameters.autoZoom && layer.bounds) nativeMap.current.mapNavigator.fit({bounds: layer.bounds, animate: true});
                }
            }
        }
    }

    return (<div className="LuciadMap" ref={divElement}></div>)
}


const BingmapsCommand = {
    action: UIActions.CreateAnyLayer,
    "parameters": {
        "layerType": UILayerTypes.BingmapsLayer,
        "model": {
            "imagerySet": "Aerial",
            token: "AugjqbGwtwHP0n0fUtpZqptdgkixBt5NXpfSzxb7q-6ATmbk-Vs4QnqiW6fhaV-i"
        },
        "layer": {
            "label": "Bingmaps",
        },
        "autoZoom": true
    }
};
