import {ISetCurrentPageActionType} from '../../components/Pagination/Pagination';

export const SET_JOBINFOS_CURRENTPAGE_STATE: string = "SET_JOBINFOS_CURRENTPAGE_STATE";
export const SET_JOBINFOS_NUMBEROFDISPLAYSPERPAGE_STATE: string = "SET_JOBINFOS_NUMBEROFDISPLAYSPERPAGE_STATE";

export function SetCurrentPage(CurrentPage: number): ISetCurrentPageActionType {
    return { type: SET_JOBINFOS_CURRENTPAGE_STATE, current_page: CurrentPage };
}

export function SetnumberOfDisplaysPerpage(numberOfDisplaysPerpage: number): ISetnumberOfDisplaysPerpageActionType {
    return { type: SET_JOBINFOS_NUMBEROFDISPLAYSPERPAGE_STATE, numberOfDisplaysPerpage: numberOfDisplaysPerpage };
}

interface ISetnumberOfDisplaysPerpageActionType { type: string, numberOfDisplaysPerpage: number };
