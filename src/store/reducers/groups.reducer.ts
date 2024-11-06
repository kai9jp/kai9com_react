import { IGroup1State,IActionBase } from "../models/root.interface";
import { ADD_GROUP1, CHANGE_GROUP1_PENDING_EDIT, EDIT_GROUP1, REMOVE_GROUP1,
    CLEAR_GROUP1_PENDING_EDIT, SET_GROUP_MODIFICATION_STATE,SET_GROUP_ALL_COUNT,CLEAR_GROUP1,
    ADD_GROUP1_HISTORY,CLEAR_GROUP1_HISTORY,ADD_GROUP2,REMOVE_GROUP2,CLEAR_GROUP2,
    SET_DATA_GROUP2,UPDATE_GROUP2} from "../actions/group1s.action";
import { IGroup1,IGroup2, Group1ModificationStatus } from "../models/group.interface";

const initialState: IGroup1State = {
    Group1s: [],
    Group2s: [],
    selectedGroup: null,
    modificationState: Group1ModificationStatus.None,
    IsFirst: false,
    all_count: 0,
    Group1Historys: [],
};

function group1Reducer(state: IGroup1State = initialState, action: IActionBase): IGroup1State {
    switch (action.type) {
        case SET_GROUP_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case CLEAR_GROUP1: {
            let group1s: IGroup1[] = state.Group1s;
            group1s = [];
            return { ...state, Group1s: group1s };
        }
        case ADD_GROUP1: {
            // let maxId: number = Math.max.apply(Math, state.Group1s.map(function(o) { return o.group_id; }));
            // action.group1.id = maxId + 1;
            return { ...state, Group1s: [...state.Group1s, action.group1]};
        }
        case EDIT_GROUP1: {
            const foundIndex: number = state.Group1s.findIndex(pr => pr.group_id === action.group1.group_id);
            let group1s: IGroup1[] = state.Group1s;
            group1s[foundIndex] = action.group1;
            return { ...state, Group1s: group1s };
        }
        case REMOVE_GROUP1: {
            return { ...state, Group1s: state.Group1s.filter(pr => pr.group_id !== action.id) };
        }
        case CHANGE_GROUP1_PENDING_EDIT: {
            return { ...state, selectedGroup: action.group1 };
        }
        case CLEAR_GROUP1_PENDING_EDIT: {
            return { ...state, selectedGroup: null };
        }
        case SET_GROUP_ALL_COUNT: 
        {
            return { ...state, all_count: action.count };
        }

        case ADD_GROUP1_HISTORY: {
            // let maxId: number = Math.max.apply(Math, state.Group1Historys.map(function(o) { return o.group_id; }));
            // action.group1.id = maxId + 1;
            return { ...state, Group1Historys: [...state.Group1Historys, action.group1]};
        }
        case CLEAR_GROUP1_HISTORY: {
            let Group1Historys: IGroup1[] = state.Group1Historys;
            Group1Historys = [];
            return { ...state, Group1Historys: Group1Historys };
        }

        case CLEAR_GROUP2: {
            let group2s: IGroup2[] = state.Group2s;
            group2s = [];
            return { ...state, Group2s: group2s };
        }

        case ADD_GROUP2: {
            const foundIndex: number = state.Group2s.findIndex(pr => pr.user_id === action.user_id);
            if (state.selectedGroup){
                if (foundIndex === -1){
                    //チェックが付いた場合、無ければ作成
                    let group2: IGroup2 = {
                        group_id: state.selectedGroup.group_id,
                        modify_count1: state.selectedGroup.modify_count1,
                        user_id: action.user_id,
                        modify_count2: 0,
                        update_u_id: 0,
                        update_date: new Date,
                        delflg: false
                    };
                    return { ...state, Group2s: [...state.Group2s, group2]};
                }else{
                    //チェックが付いた場合、有れば既存データを再利用
                    let group2s: IGroup2[] = state.Group2s;
                    let group2: IGroup2 =　group2s[foundIndex];
                    group2.delflg = false;
                    group2s[foundIndex]　=  group2;
                    return { ...state, Group2s: group2s };
                }
            }
        }
        case REMOVE_GROUP2: {
            const foundIndex: number = state.Group2s.findIndex(pr => pr.user_id === action.user_id);
            if (state.selectedGroup){
                if (foundIndex === -1){
                    //チェックが外れた場合、無ければ何もしない
                }else{
                    //チェックが外れた場合、有ればdelflgをon
                    let group2s: IGroup2[] = state.Group2s;
                    let group2: IGroup2 =　group2s[foundIndex];
                    group2.delflg = true;
                    group2s[foundIndex]　=  group2;
                    if (group2.modify_count2 !== 0){
                        return { ...state, Group2s: group2s };
                    }else{
                        //但し更新回数が0の場合は破棄
                        return { ...state, Group2s: state.Group2s.filter(pr => pr.user_id !== action.user_id) };
                    }
                }
            }
        }

        case SET_DATA_GROUP2: {
            let group2: IGroup2 = {
                group_id: action.group2.group_id,
                modify_count1: action.group2.modify_count1,
                user_id: action.group2.user_id,
                modify_count2: action.group2.modify_count2,
                update_u_id: action.group2.update_u_id,
                update_date: action.group2.update_date,
                delflg: action.group2.delflg
            };
            return { ...state, Group2s: [...state.Group2s, group2]};
        }

        case UPDATE_GROUP2: {
            const foundIndex: number = state.Group2s.findIndex(pr => pr.user_id === action.group2.user_id);
            if (state.selectedGroup){
                if (foundIndex !== -1){
                    //既存データを更新
                    let group2s: IGroup2[] = state.Group2s;
                    let group2: IGroup2 =　group2s[foundIndex];
                    group2.group_id      = action.group2.group_id;
                    group2.modify_count1 = action.group2.modify_count1;
                    group2.user_id       = action.group2.user_id;
                    group2.modify_count2 = action.group2.modify_count2;
                    group2.update_u_id   = action.group2.update_u_id;
                    group2.update_date   = action.group2.update_date;
                    group2.delflg        = action.group2.delflg;
                    group2s[foundIndex]　=  group2;
                    return { ...state, Group2s: group2s };
                }
            }
        }

        default:
            return state;
    }
}

export default group1Reducer;