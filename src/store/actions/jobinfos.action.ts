import { IJobinfo, JobinfoModificationStatus} from "../models/jobinfo.interface";
import { IJobServer} from "../models/jobserver.interface";

export const SET_JOBINFO_MODIFICATION_STATE: string = "SET_JOBINFO_MODIFICATION_STATE";
export const ADD_JOBINFO: string = "ADD_JOBINFO";
export const EDIT_JOBINFO: string = "EDIT_JOBINFO";
export const REMOVE_JOBINFO: string = "REMOVE_JOBINFO";
export const CHANGE_JOBINFO_PENDING_EDIT: string = "CHANGE_JOBINFO_PENDING_EDIT";
export const CLEAR_JOBINFO_PENDING_EDIT: string = "CLEAR_JOBINFO_PENDING_EDIT";
export const CLEAR_JOBINFO: string = "CLEAR_JOBINFO";
export const ADD_JOBINFO_HISTORY: string = "ADD_JOBINFO_HISTORY";
export const CLEAR_JOBINFO_HISTORY: string = "CLEAR_JOBINFO_HISTORY";

//---------------------------------------------------------------------
//jobServer
//---------------------------------------------------------------------
export const CLEAR_JOBSERVER: string = "CLEAR_JOBSERVER";
export const ADD_JOBSERVER: string = "ADD_JOBSERVER";
export const REMOVE_JOBSERVER: string = "REMOVE_JOBSERVER";
export const CLEAR_JOBSERVERS: string = "CLEAR_JOBSERVERS";
export const SET_DATA_JOBSERVER: string = "SET_DATA_JOBSERVER";
export const UPDATE_JOBSERVER: string = "UPDATE_JOBSERVER";


export function ClearJobinfo(): IClearJobinfoActionType {
    return { type: CLEAR_JOBINFO };
}

export function addJobinfo(jobinfo: IJobinfo): IAddJobinfoActionType {
    return { type: ADD_JOBINFO, jobinfo: jobinfo };
}

export function editJobinfo(jobinfo: IJobinfo): IEditJobinfoActionType {
    return { type: EDIT_JOBINFO, jobinfo: jobinfo };
}

export function removeJobinfo(id: number): IRemoveJobinfoActionType {
    return { type: REMOVE_JOBINFO, id: id };
}

export function changeSelectedJobinfo(jobinfo: IJobinfo): IChangeSelectedJobinfoActionType {
    return { type: CHANGE_JOBINFO_PENDING_EDIT, jobinfo: jobinfo };
}

export function clearSelectedJobinfo(): IClearSelectedJobinfoActionType {
    return { type: CLEAR_JOBINFO_PENDING_EDIT };
}

export function setModificationState(value: JobinfoModificationStatus): ISetModificationStateActionType {
    return { type: SET_JOBINFO_MODIFICATION_STATE, value: value };
}

export function ClearJobinfohistory(): IClearJobinfoHistoryActionType {
    return { type: CLEAR_JOBINFO_HISTORY };
}

export function addJobinfoHistory(jobinfo: IJobinfo): IAddJobinfoHistoryActionType {
    return { type: ADD_JOBINFO_HISTORY, jobinfo: jobinfo };
}

//---------------------------------------------------------------------
//jobServer
//---------------------------------------------------------------------
export function ClearJobServer(): IClearJobServersActionType {
    return { type: CLEAR_JOBSERVER };
}

export function addJobServer(jobinfo_id: number,server_id: number): IAddJobServersActionType {
    return { type: ADD_JOBSERVER, jobinfo_id: jobinfo_id, server_id: server_id };
}

export function removeJobServer(server_id: number): IRemoveJobServersActionType {
    return { type: REMOVE_JOBSERVER, server_id: server_id };
}

export function setDataJobServer(jobserver: IJobServer): ISetDataJobServersActionType {
    return { type: SET_DATA_JOBSERVER, jobserver: jobserver };
}

export function updateJobServer(jobserver: IJobServer): IUpdateJobServersActionType {
    return { type: UPDATE_JOBSERVER, jobserver: jobserver };
}


interface ISetModificationStateActionType { type: string, value:  JobinfoModificationStatus};
interface IClearJobinfoActionType { type: string };
interface IAddJobinfoActionType { type: string, jobinfo: IJobinfo };
interface IEditJobinfoActionType { type: string, jobinfo: IJobinfo };
interface IRemoveJobinfoActionType { type: string, id: number };
interface IChangeSelectedJobinfoActionType { type: string, jobinfo: IJobinfo };
interface IClearSelectedJobinfoActionType { type: string };
interface ISetModificationStateActionType { type: string, value:  JobinfoModificationStatus};
interface IClearJobinfoHistoryActionType { type: string };
interface IAddJobinfoHistoryActionType { type: string, jobinfo: IJobinfo };


//---------------------------------------------------------------------
//jobServer
//---------------------------------------------------------------------
interface IClearJobServersActionType { type: string };
interface IAddJobServersActionType { type: string, jobinfo_id: number, server_id: number };
interface IRemoveJobServersActionType { type: string, server_id: number };
interface ISetDataJobServersActionType { type: string, jobserver: IJobServer };
interface IUpdateJobServersActionType { type: string, jobserver: IJobServer };
