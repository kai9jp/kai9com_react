import { IActionBase,IApp_envPagenationState } from "../models/root.interface";
import { SET_PAG_App_env_CURRENTPAGE_STATE,SET_PAG_App_env_NUMBEROFDISPLAYSPERPAGE_STATE} from "../actions/app_envPagenation.action";

const initialState: IApp_envPagenationState = {
    CurrentPage: 1,
    numberOfDisplaysPerpage:100
};

function App_envPagenationReducer(state: IApp_envPagenationState = initialState, action: IActionBase): IApp_envPagenationState {
    switch (action.type) {
        case SET_PAG_App_env_CURRENTPAGE_STATE: {
            return { ...state, CurrentPage: action.current_page };
        }
        case SET_PAG_App_env_NUMBEROFDISPLAYSPERPAGE_STATE: {
            return { ...state, numberOfDisplaysPerpage: action.numberOfDisplaysPerpage };
        }
        default:
            return state;
    }
};

export default App_envPagenationReducer;
