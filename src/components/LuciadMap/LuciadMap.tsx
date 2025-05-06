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
import {LayerUtils} from "../../modules/luciad/utils/LayerUtils.ts";

export const LuciadMap: React.FC = () => {
    const divElement = useRef(null as null | HTMLDivElement);
    const nativeMap = useRef(null as null | WebGLMap);
    const mapHasInitialized = useRef(false);

    const {setMainMap, command} = useComService();

    useEffect(()=> {
        // Initialize Map
        if (divElement.current !== null) {
            if (nativeMap.current !== null) nativeMap.current.destroy();
            nativeMap.current = new WebGLMap(divElement.current, {reference: getReference("EPSG:4978")});
            setMainMap(nativeMap.current);
            if (!mapHasInitialized.current) {
                mapHasInitialized.current = true;
                initialize().then(() => {
                   console.log("Map has initialized!!");
                });
            }
        }
        return ()=>{
            // Destroy map
            if (nativeMap.current) nativeMap.current.destroy();
        }
    }, []);

    const initialize = async () => {
        await createAnyLayer(BingmapsCommand);
        await createAnyLayer(WMSCommand);
        const layerGroup = await createAnyLayer(LayerGroupCommand);

        MeshCommand.parameters.layer.parentId = layerGroup.id;
        PoitCloudCommand.parameters.layer.parentId = layerGroup.id;
        await createAnyLayer(MeshCommand);
        await createAnyLayer(PoitCloudCommand);
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
            if (newCommand.parameters.layer.parentId) {
                const group = nativeMap.current.layerTree.findLayerGroupById(newCommand.parameters.layer.parentId);
                if (group) group.addChild(node);
            } else {
                nativeMap.current.layerTree.addChild(node);
            }
            if (node instanceof Layer ) {
                const layer = node as Layer | LayerGroup;
                if (layer instanceof Layer ) {
                    LayerUtils.zoomToLayer(nativeMap.current, layer);
                }
            }
        }
        return node;
    }

    return (<div className="LuciadMap" ref={divElement}></div>)
}

const LayerGroupCommand = {
    action: UIActions.CreateAnyLayer,
    "parameters": {
        "layerType": UILayerTypes.LayerGroup,
        "layer": {
            "label": "Marseille",
        },
        "autoZoom": true
    }
};

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

const WMSCommand = {
    action: UIActions.CreateAnyLayer,
    "parameters": {
        "layerType": UILayerTypes.WMSLayer,
        model: {
            url: "https://sampleservices.luciad.com/wms",
            layers: [{layer: "4ceea49c-3e7c-4e2d-973d-c608fb2fb07e"}]
        },
        layer: {
            label: "WMS Layer",
        },
        "autoZoom": true
    }
}

const MeshCommand = {
    action: UIActions.CreateAnyLayer,
    "parameters": {
        "layerType": UILayerTypes.OGC3DTILES,
        "model": {
            "url": "https://sampleservices.luciad.com/ogc/3dtiles/marseille-mesh/tileset.json"
        },
        "layer": {
            "label": "Marseille-Mesh",
            parentId: null as string | null
        },
        "autoZoom": true
    }
} ;

const PoitCloudCommand = {
    action: UIActions.CreateAnyLayer,
    "parameters": {
        "layerType": UILayerTypes.OGC3DTILES,
        "model": {
            "url": "https://sampleservices.luciad.com/ogc/3dtiles/marseille-lidar/tileset.json"
        },
        "layer": {
            "label": "Marseille-Lidar",
            parentId: null as string | null
        },
        "autoZoom": true
    }
};
