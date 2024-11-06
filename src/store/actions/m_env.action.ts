import { IM_env, M_envModificationStatus} from "../models/m_env.interface";

export const SET_M_ENV_MODIFICATION_STATE: string = "SET_M_ENV_MODIFICATION_STATE";
export const SET_M_ENV: string = "EDIT_M_ENV";
export const REMOVE_M_ENV: string = "REMOVE_M_ENV";
export const CHANGE_M_ENV_PENDING_EDIT: string = "CHANGE_M_ENV_PENDING_EDIT";
export const CLEAR_M_ENV_PENDING_EDIT: string = "CLEAR_M_ENV_PENDING_EDIT";
export const SET_M_ENV_ALL_COUNT: string = "SET_M_ENV_ALL_COUNT";
export const CLEAR_M_ENV: string = "CLEAR_M_ENV";
export const ADD_M_ENV_HISTORY: string = "ADD_M_ENV_HISTORY";
export const CLEAR_M_ENV_HISTORY: string = "CLEAR_M_ENV_HISTORY";

export function ClearM_env(): IClearM_envActionType {
    return { type: CLEAR_M_ENV };
}

export function setM_env(m_env: IM_env): ISetM_envActionType {
    return { type: SET_M_ENV, m_env: m_env };
}

export function removeM_env(varchar300: string): IRemoveM_envActionType {
    return { type: REMOVE_M_ENV, varchar300: varchar300 };
}

export function changeSelectedM_env(m_env: IM_env): IChangeSelectedM_envActionType {
    return { type: CHANGE_M_ENV_PENDING_EDIT, m_env: m_env };
}

export function clearSelectedM_env(): IClearSelectedM_envActionType {
    return { type: CLEAR_M_ENV_PENDING_EDIT };
}

export function setModificationState(value: M_envModificationStatus): ISetModificationStateActionType {
    return { type: SET_M_ENV_MODIFICATION_STATE, value: value };
}

export function setAllCount(count: number): ISetAllCountActionType {
    return { type: SET_M_ENV_ALL_COUNT, count: count };
}


export function ClearM_envhistory(): IClearM_envHistoryActionType {
    return { type: CLEAR_M_ENV_HISTORY };
}

export function addM_envHistory(m_env: IM_env): IAddM_envHistoryActionType {
    return { type: ADD_M_ENV_HISTORY, m_env: m_env };
}


interface ISetModificationStateActionType { type: string, value:  M_envModificationStatus};

interface IClearM_envActionType { type: string };
interface ISetM_envActionType { type: string, m_env: IM_env };
interface IRemoveM_envActionType { type: string, varchar300: string };
interface IChangeSelectedM_envActionType { type: string, m_env: IM_env };
interface IClearSelectedM_envActionType { type: string };
interface ISetModificationStateActionType { type: string, value:  M_envModificationStatus};
interface ISetAllCountActionType { type: string, count: number };
interface IClearM_envHistoryActionType { type: string };
interface IAddM_envHistoryActionType { type: string, m_env: IM_env };
