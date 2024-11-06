import { IActionBase,IGroupPagenationState } from "../models/root.interface";
import { SET_GROUPS_CURRENTPAGE_STATE,SET_GROUPS_NUMBEROFDISPLAYSPERPAGE_STATE} from "../actions/groupspagenation.action";

const initialState: IGroupPagenationState = {
    CurrentPage: 1,
    numberOfDisplaysPerpage:100
};

function groupPagenationReducer(state: IGroupPagenationState = initialState, action: IActionBase): IGroupPagenationState {
    switch (action.type) {
        case SET_GROUPS_CURRENTPAGE_STATE: {
            return { ...state, CurrentPage: action.current_page };
        }
        case SET_GROUPS_NUMBEROFDISPLAYSPERPAGE_STATE: {
            return { ...state, numberOfDisplaysPerpage: action.numberOfDisplaysPerpage };
        }
        default:
            return state;
    }
};

export default groupPagenationReducer;