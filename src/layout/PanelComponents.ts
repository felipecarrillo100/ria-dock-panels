import {LuciadMapPanel} from "./panels/LuciadMapPanel.tsx";
import {DefaultPanel} from "./panels/DefaultPanel.tsx";
import {TimePanel} from "./panels/TimePanel.tsx";
import {MoviePanel} from "./panels/MoviePanel.tsx";
import {ProjectionPanel} from "./panels/ProjectionPanel.tsx";

export const PanelComponents = {
    'main-map-panel': LuciadMapPanel,
    'my-panel': DefaultPanel,
    'projection-panel': ProjectionPanel,
    'time-panel': TimePanel,
    'movie-panel': MoviePanel,
}
