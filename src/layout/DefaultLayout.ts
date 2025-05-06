import {Orientation, type SerializedDockview} from "dockview-react";

export const DefaultLayout: SerializedDockview = {
    "grid": {
        "root": {
            "type": "branch",
            "data": [{
                "type": "branch",
                "data": [{
                    "type": "leaf",
                    "data": {"views": ["panel-map"], "activeView": "panel-map", "id": "1"},
                    "size": 844
                }, {
                    "type": "leaf",
                    "data": {"views": ["panel-time"], "activeView": "panel-time", "id": "3"},
                    "size": 229
                }],
                "size": 1559
            }, {
                "type": "branch",
                "data": [{
                    "type": "leaf",
                    "data": {"views": ["panel-1", "panel-2"], "activeView": "panel-1", "id": "2"},
                    "size": 542
                }, {"type": "leaf", "data": {"views": ["panel-5"], "activeView": "panel-5", "id": "4"}, "size": 531}],
                "size": 361
            }],
            "size": 1073
        }, "width": 1920, "height": 1073, "orientation": Orientation.HORIZONTAL
    },
    "panels": {
        "panel-map": {
            "id": "panel-map",
            "contentComponent": "main-map-panel",
            "tabComponent": "no-close",
            "title": "Map"
        },
        "panel-time": {"id": "panel-time", "contentComponent": "time-panel", "title": "Time Control"},
        "panel-1": {"id": "panel-1", "contentComponent": "my-panel", "title": "Layers"},
        "panel-2": {"id": "panel-2", "contentComponent": "projection-panel", "title": "Map Settings"},
        "panel-5": {"id": "panel-5", "contentComponent": "movie-panel", "title": "Video"}
    },
    "activeGroup": "3"
}
