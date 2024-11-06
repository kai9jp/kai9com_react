import { IServer, ServerModificationStatus} from "../models/server.interface";

export const SET_SERVER_MODIFICATION_STATE: string = "SET_SERVER_MODIFICATION_STATE";
export const ADD_SERVER: string = "ADD_SERVER";
export const EDIT_SERVER: string = "EDIT_SERVER";
export const REMOVE_SERVER: string = "REMOVE_SERVER";
export const CHANGE_SERVER_PENDING_EDIT: string = "CHANGE_SERVER_PENDING_EDIT";
export const CLEAR_SERVER_PENDING_EDIT: string = "CLEAR_SERVER_PENDING_EDIT";
export const CLEAR_SERVER: string = "CLEAR_SERVER";
export const ADD_SERVER_HISTORY: string = "ADD_SERVER_HISTORY";
export const CLEAR_SERVER_HISTORY: string = "CLEAR_SERVER_HISTORY";

export function ClearServer(): IClearServerActionType {
    return { type: CLEAR_SERVER };
}

export function addServer(server: IServer): IAddServerActionType {
    return { type: ADD_SERVER, server: server };
}

export function editServer(server: IServer): IEditServerActionType {
    return { type: EDIT_SERVER, server: server };
}

export function removeServer(id: number): IRemoveServerActionType {
    return { type: REMOVE_SERVER, id: id };
}

export function changeSelectedServer(server: IServer): IChangeSelectedServerActionType {
    return { type: CHANGE_SERVER_PENDING_EDIT, server: server };
}

export function clearSelectedServer(): IClearSelectedServerActionType {
    return { type: CLEAR_SERVER_PENDING_EDIT };
}

export function setModificationState(value: ServerModificationStatus): ISetModificationStateActionType {
    return { type: SET_SERVER_MODIFICATION_STATE, value: value };
}

export function ClearServerhistory(): IClearServerHistoryActionType {
    return { type: CLEAR_SERVER_HISTORY };
}

export function addServerHistory(server: IServer): IAddServerHistoryActionType {
    return { type: ADD_SERVER_HISTORY, server: server };
}


interface ISetModificationStateActionType { type: string, value:  ServerModificationStatus};

interface IClearServerActionType { type: string };
interface IAddServerActionType { type: string, server: IServer };
interface IEditServerActionType { type: string, server: IServer };
interface IRemoveServerActionType { type: string, id: number };
interface IChangeSelectedServerActionType { type: string, server: IServer };
interface IClearSelectedServerActionType { type: string };
interface ISetModificationStateActionType { type: string, value:  ServerModificationStatus};
interface IClearServerHistoryActionType { type: string };
interface IAddServerHistoryActionType { type: string, server: IServer };
