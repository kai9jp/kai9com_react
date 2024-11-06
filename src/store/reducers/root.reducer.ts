import { combineReducers, Reducer } from "redux";
import { UPDATE_CURRENT_PATH } from "../actions/root.actions";
import { IRootStateType, IActionBase, IStateType } from "../models/root.interface";
import productsReducer from "./products.reducer";
import notificationReducer from "./notification.reducer";
import userReducer from "./users.reducer";
import groupReducer from "./groups.reducer";
import orderReducer from "./order.reducer";
import accountReducer from "./account.reducer";
import autologoffReducer from "./autologoff.reducer";
import usersagenationReducer from "./userspagenation.reducer";
import groupspagenationReducer from "./groupspagenation.reducer";
import App_envReducer from "./app_env.reducer";
import App_envPagenationReducer from "./app_envPagenation.reducer";



//[宮村]reduxのstateについて
//3階層先のインターフェースに有るareaとsubAreaに初期値を設定している
const initialState: IRootStateType = {
    page: {area: "home", subArea: ""}
};

//[宮村]reduxについて
//reduxは、state(状態を記憶)と、action(イベント)で構成される
//https://future-architect.github.io/articles/20200429/
function rootReducer(state: IRootStateType = initialState, action: IActionBase): IRootStateType {
    switch (action.type) {
        //[宮村]各画面から、ディスパッチされて、typeにUPDATE_CURRENT_PATH、及び、エリア＆サブエリアが入ってくる
        case UPDATE_CURRENT_PATH:
            return { ...state, page: {area: action.area, subArea: action.subArea}};
        default:
            return state;
    }
}

const rootReducers: Reducer<IStateType> = combineReducers({
    //[宮村]combineReducersについて
    //複数のreducerを単一のreducerに変換してくれる

    //[宮村]各reducerは、各インターフェースに紐付いて生成される(各reducerを参照)
    root: rootReducer,
    products: productsReducer,
    notifications: notificationReducer,
    users: userReducer,
    userspagenation: usersagenationReducer,
    groupspagenation: groupspagenationReducer,
    orders: orderReducer,
    account: accountReducer,
    groups: groupReducer,
    autologoff:autologoffReducer, 
    App_envs: App_envReducer,
    App_envPagenation: App_envPagenationReducer,
});



export default rootReducers;