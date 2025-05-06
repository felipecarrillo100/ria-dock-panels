import {UIActions} from "../../../interfaces/UIActions.ts";
import {UILayerTypes} from "../interfaces/UILayerTypes.ts";

export const LayerGroupCommand = {
    action: UIActions.CreateAnyLayer,
    "parameters": {
        "layerType": UILayerTypes.LayerGroup,
        "layer": {
            "label": "Marseille",
        },
        "autoZoom": true
    }
};

export const WMSCommand = {
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

export const MeshCommand = {
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

export const PoitCloudCommand = {
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
