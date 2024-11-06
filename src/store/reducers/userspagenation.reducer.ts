import { IActionBase,IUserPagenationState } from "../models/root.interface";
import { SET_USERS_CURRENTPAGE_STATE,SET_USERS_NUMBEROFDISPLAYSPERPAGE_STATE} from "../actions/userspagenation.action";

const initialState: IUserPagenationState = {
    CurrentPage: 1,
    numberOfDisplaysPerpage:100
};

function userPagenationReducer(state: IUserPagenationState = initialState, action: IActionBase): IUserPagenationState {
    switch (action.type) {
        case SET_USERS_CURRENTPAGE_STATE: {
            return { ...state, CurrentPage: action.current_page };
        }
        case SET_USERS_NUMBEROFDISPLAYSPERPAGE_STATE: {
            return { ...state, numberOfDisplaysPerpage: action.numberOfDisplaysPerpage };
        }
        default:
            return state;
    }
};

export default userPagenationReducer;