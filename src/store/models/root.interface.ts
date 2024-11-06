import { IProduct, ProductModificationStatus } from "./product.interface";
import { INotification } from "./notification.interface";
import { IUser,UserModificationStatus } from "./user.interface";
import { IGroup1,IGroup2,Group1ModificationStatus } from "./group.interface";
import { IOrder } from "./order.interface";
import { IAccount } from "./account.interface";
import { IAutoLogOff } from "./autologoff.interface";
import { IApp_env,App_envModificationStatus } from "./app_env.interface";


export interface IRootPageStateType {
    area: string;
    subArea: string;
}

export interface IRootStateType {
    page: IRootPageStateType;
}

//[宮村]interfaceについて
//JavaScriptには無く、TypeScriptにしかない構文。オブジェクト指向でコーディング可能
//https://typescriptbook.jp/reference/object-oriented/interface
export interface IStateType {
    root: IRootStateType;
    products: IProductState;
    notifications: INotificationState;
    users: IUserState;
    userspagenation: IUserPagenationState;
    groupspagenation: IGroupPagenationState;
    orders: IOrdersState;
    account: IAccount;
    groups: IGroup1State;
    autologoff: IAutoLogOff;
    App_envs: IApp_envState;
    App_envPagenation: IApp_envPagenationState;
}

export interface IProductState {
    products: IProduct[];
    selectedProduct: IProduct | null;
    modificationState: ProductModificationStatus;
}

export interface IUserState {
    Users: IUser[];
    selectedUser: IUser | null;
    modificationState: UserModificationStatus;
    IsFirst: boolean;
    all_count: number;
    admin_count: number;
    normal_count: number;
    readonly_count: number;
    UserHistorys: IUser[];
}

export interface IGroup1State {
    Group1s: IGroup1[];
    Group2s: IGroup2[];
    selectedGroup: IGroup1 | null;
    modificationState: Group1ModificationStatus;
    IsFirst: boolean;
    all_count: number;
    Group1Historys: IGroup1[];
}

export interface InumberOfDisplaysPerpageState {
    value: number;
}

export interface IUserPagenationState {
    CurrentPage: number;
    numberOfDisplaysPerpage: number;
}

export interface IGroupPagenationState {
    CurrentPage: number;
    numberOfDisplaysPerpage: number;
}

export interface IServerPagenationState {
    CurrentPage: number;
    numberOfDisplaysPerpage: number;
}

export interface IJobinfoPagenationState {
    CurrentPage: number;
    numberOfDisplaysPerpage: number;
}

export interface IActionBase {
    type: string;
    //[宮村]ここは恐らく動的配列
    [prop: string]: any;
}

export interface IOrdersState {
    orders: IOrder[];
}

export interface INotificationState {
    notifications: INotification[];
}

export interface IApp_envState {
    App_env: IApp_env | null;
    modificationState: App_envModificationStatus;
    IsFirst: boolean;
    all_count: number;
    App_envHistorys: IApp_env[];
}

export interface IApp_envPagenationState {
    CurrentPage: number;
    numberOfDisplaysPerpage: number;
}
