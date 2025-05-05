import {UIActions} from "./UIActions.ts";

export interface UICommand {
    action: UIActions,
    parameters?: any
}
