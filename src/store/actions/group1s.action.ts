import { IGroup1,IGroup2, Group1ModificationStatus} from "../models/group.interface";

export const SET_GROUP_MODIFICATION_STATE: string = "SET_GROUP_MODIFICATION_STATE";
export const ADD_GROUP1: string = "ADD_GROUP1";
export const EDIT_GROUP1: string = "EDIT_GROUP1";
export const REMOVE_GROUP1: string = "REMOVE_GROUP1";
export const CHANGE_GROUP1_PENDING_EDIT: string = "CHANGE_GROUP1_PENDING_EDIT";
export const CLEAR_GROUP1_PENDING_EDIT: string = "CLEAR_GROUP1_PENDING_EDIT";
export const SET_GROUP_ALL_COUNT: string = "SET_GROUP_ALL_COUNT";
export const CLEAR_GROUP1: string = "CLEAR_GROUP1";
export const ADD_GROUP1_HISTORY: string = "ADD_GROUP1_HISTORY";
export const CLEAR_GROUP1_HISTORY: string = "CLEAR_GROUP1_HISTORY";
export const ADD_GROUP2: string = "ADD_GROUP2";
export const REMOVE_GROUP2: string = "REMOVE_GROUP2";
export const CLEAR_GROUP2: string = "CLEAR_GROUP2";
export const SET_DATA_GROUP2: string = "SET_DATA_GROUP2";
export const UPDATE_GROUP2: string = "UPDATE_GROUP2";


export function ClearGroup1(): IClearGroup1ActionType {
    return { type: CLEAR_GROUP1 };
}

export function addGroup1(group1: IGroup1): IAddGroup1ActionType {
    return { type: ADD_GROUP1, group1: group1 };
}

export function editGroup1(group1: IGroup1): IEditGroup1ActionType {
    return { type: EDIT_GROUP1, group1: group1 };
}

export function removeGroup1(id: number): IRemoveGroup1ActionType {
    return { type: REMOVE_GROUP1, id: id };
}

export function changeSelectedGroup1(group1: IGroup1): IChangeSelectedGroup1ActionType {
    return { type: CHANGE_GROUP1_PENDING_EDIT, group1: group1 };
}

export function clearSelectedGroup1(): IClearSelectedGroup1ActionType {
    return { type: CLEAR_GROUP1_PENDING_EDIT };
}

export function setModificationState(value: Group1ModificationStatus): ISetModificationStateActionType {
    return { type: SET_GROUP_MODIFICATION_STATE, value: value };
}

export function setAllCount(count: number): ISetAllCountActionType {
    return { type: SET_GROUP_ALL_COUNT, count: count };
}

export function ClearGroup1history(): IClearGroup1HistoryActionType {
    return { type: CLEAR_GROUP1_HISTORY };
}

export function addGroup1History(group1: IGroup1): IAddGroup1HistoryActionType {
    return { type: ADD_GROUP1_HISTORY, group1: group1 };
}


export function ClearGroup2(): IClearGroup2ActionType {
    return { type: CLEAR_GROUP2 };
}

export function addGroup2(user_id: number): IAddGroup2ActionType {
    return { type: ADD_GROUP2, user_id: user_id };
}

export function removeGroup2(user_id: number): IRemoveGroup2ActionType {
    return { type: REMOVE_GROUP2, user_id: user_id };
}

export function setDataGroup2(group2: IGroup2): ISetDataGroup2ActionType {
    return { type: SET_DATA_GROUP2, group2: group2 };
}

export function updateGroup2(group2: IGroup2): IUpdateGroup2ActionType {
    return { type: UPDATE_GROUP2, group2: group2 };
}


interface ISetModificationStateActionType { type: string, value:  Group1ModificationStatus};

interface IClearGroup1ActionType { type: string };
interface IAddGroup1ActionType { type: string, group1: IGroup1 };
interface IEditGroup1ActionType { type: string, group1: IGroup1 };
interface IRemoveGroup1ActionType { type: string, id: number };
interface IChangeSelectedGroup1ActionType { type: string, group1: IGroup1 };
interface IClearSelectedGroup1ActionType { type: string };
interface ISetModificationStateActionType { type: string, value:  Group1ModificationStatus};
interface ISetAllCountActionType { type: string, count: number };
interface IClearGroup1HistoryActionType { type: string };
interface IClearGroup2ActionType { type: string };
interface IAddGroup1HistoryActionType { type: string, group1: IGroup1 };
interface IAddGroup2ActionType { type: string, user_id: number };
interface IRemoveGroup2ActionType { type: string, user_id: number };
interface ISetDataGroup2ActionType { type: string, group2: IGroup2 };
interface IUpdateGroup2ActionType { type: string, group2: IGroup2 };

