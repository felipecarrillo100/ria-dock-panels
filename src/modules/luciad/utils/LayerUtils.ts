import type {Layer} from "@luciad/ria/view/Layer.js";
import type {WebGLMap} from "@luciad/ria/view/WebGLMap.js";

export class LayerUtils {
    public static zoomToLayer(map: WebGLMap, layer: Layer) {
        if (layer.bounds) map.mapNavigator.fit({bounds: layer.bounds, animate: true}).catch();
    }
}
