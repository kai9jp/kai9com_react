import { IUserState,IActionBase } from "../models/root.interface";
import { ADD_USER, CHANGE_USER_PENDING_EDIT, EDIT_USER, REMOVE_USER,
    CLEAR_USER_PENDING_EDIT, SET_USER_MODIFICATION_STATE,SET_USER_ALL_COUNT,
    SET_ADMIN_COUNT,SET_NORMAL_COUNT,SET_READONLY_COUNT,CLEAR_USER,
    ADD_USER_HISTORY,CLEAR_USER_HISTORY} from "../actions/users.action";
import { IUser, UserModificationStatus } from "../models/user.interface";

const initialState: IUserState = {
    Users: [],
    selectedUser: null,
    modificationState: UserModificationStatus.None,
    IsFirst: false,
    all_count: 0,
    admin_count: 0,
    normal_count: 0,
    readonly_count: 0,
    UserHistorys: [],
};

function userReducer(state: IUserState = initialState, action: IActionBase): IUserState {
    switch (action.type) {
        case SET_USER_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case CLEAR_USER: {
            let users: IUser[] = state.Users;
            users = [];
            return { ...state, Users: users };
        }
        case ADD_USER: {
            // let maxId: number = Math.max.apply(Math, state.Users.map(function(o) { return o.user_id; }));
            // action.user.id = maxId + 1;
            return { ...state, Users: [...state.Users, action.user]};
        }
        case EDIT_USER: {
            const foundIndex: number = state.Users.findIndex(pr => pr.user_id === action.user.id);
            let users: IUser[] = state.Users;
            users[foundIndex] = action.user;
            return { ...state, Users: users };
        }
        case REMOVE_USER: {
            return { ...state, Users: state.Users.filter(pr => pr.user_id !== action.id) };
        }
        case CHANGE_USER_PENDING_EDIT: {
            return { ...state, selectedUser: action.user };
        }
        case CLEAR_USER_PENDING_EDIT: {
            return { ...state, selectedUser: null };
        }
        case SET_USER_ALL_COUNT: 
        {
            return { ...state, all_count: action.count };
        }
        case SET_ADMIN_COUNT: 
        {
            return { ...state, admin_count: action.count };
        }
        case SET_NORMAL_COUNT: 
        {
            return { ...state, normal_count: action.count };
        }
        case SET_READONLY_COUNT: 
        {
            return { ...state, readonly_count: action.count };
        }

        case ADD_USER_HISTORY: {
            // let maxId: number = Math.max.apply(Math, state.UserHistorys.map(function(o) { return o.user_id; }));
            // action.user.id = maxId + 1;
            return { ...state, UserHistorys: [...state.UserHistorys, action.user]};
        }
        case CLEAR_USER_HISTORY: {
            let UserHistorys: IUser[] = state.UserHistorys;
            UserHistorys = [];
            return { ...state, UserHistorys: UserHistorys };
        }


        default:
            return state;
    }
}

export default userReducer;