import { IUser, UserModificationStatus} from "../models/user.interface";

export const SET_USER_MODIFICATION_STATE: string = "SET_USER_MODIFICATION_STATE";
export const ADD_USER: string = "ADD_USER";
export const EDIT_USER: string = "EDIT_USER";
export const REMOVE_USER: string = "REMOVE_USER";
export const CHANGE_USER_PENDING_EDIT: string = "CHANGE_USER_PENDING_EDIT";
export const CLEAR_USER_PENDING_EDIT: string = "CLEAR_USER_PENDING_EDIT";
export const SET_USER_ALL_COUNT: string = "SET_USER_ALL_COUNT";
export const SET_ADMIN_COUNT: string = "SET_ADMIN_COUNT";
export const SET_NORMAL_COUNT: string = "SET_NORMAL_COUNT";
export const SET_READONLY_COUNT: string = "SET_READONLY_COUNT";
export const CLEAR_USER: string = "CLEAR_USER";
export const ADD_USER_HISTORY: string = "ADD_USER_HISTORY";
export const CLEAR_USER_HISTORY: string = "CLEAR_USER_HISTORY";

export function ClearUser(): IClearUserActionType {
    return { type: CLEAR_USER };
}

export function addUser(user: IUser): IAddUserActionType {
    return { type: ADD_USER, user: user };
}

export function editUser(user: IUser): IEditUserActionType {
    return { type: EDIT_USER, user: user };
}

export function removeUser(id: number): IRemoveUserActionType {
    return { type: REMOVE_USER, id: id };
}

export function changeSelectedUser(user: IUser): IChangeSelectedUserActionType {
    return { type: CHANGE_USER_PENDING_EDIT, user: user };
}

export function clearSelectedUser(): IClearSelectedUserActionType {
    return { type: CLEAR_USER_PENDING_EDIT };
}

export function setModificationState(value: UserModificationStatus): ISetModificationStateActionType {
    return { type: SET_USER_MODIFICATION_STATE, value: value };
}

export function setAllCount(count: number): ISetAllCountActionType {
    return { type: SET_USER_ALL_COUNT, count: count };
}

export function setAdminCount(count: number): ISetAdminCountActionType {
    return { type: SET_ADMIN_COUNT, count: count };
}

export function setNormalCount(count: number): ISetNormalCountActionType {
    return { type: SET_NORMAL_COUNT, count: count };
}

export function setReadonlyCount(count: number): ISetReadonlyCountActionType {
    return { type: SET_READONLY_COUNT, count: count };
}


export function ClearUserhistory(): IClearUserHistoryActionType {
    return { type: CLEAR_USER_HISTORY };
}

export function addUserHistory(user: IUser): IAddUserHistoryActionType {
    return { type: ADD_USER_HISTORY, user: user };
}


interface ISetModificationStateActionType { type: string, value:  UserModificationStatus};

interface IClearUserActionType { type: string };
interface IAddUserActionType { type: string, user: IUser };
interface IEditUserActionType { type: string, user: IUser };
interface IRemoveUserActionType { type: string, id: number };
interface IChangeSelectedUserActionType { type: string, user: IUser };
interface IClearSelectedUserActionType { type: string };
interface ISetModificationStateActionType { type: string, value:  UserModificationStatus};
interface ISetAllCountActionType { type: string, count: number };
interface ISetAdminCountActionType { type: string, count: number };
interface ISetNormalCountActionType { type: string, count: number };
interface ISetReadonlyCountActionType { type: string, count: number };
interface IClearUserHistoryActionType { type: string };
interface IAddUserHistoryActionType { type: string, user: IUser };
