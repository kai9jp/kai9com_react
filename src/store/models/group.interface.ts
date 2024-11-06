export interface IGroup1 {
    group_id: number;
    modify_count1: number;
    group_name: string;
    note: string;
    update_u_id: number;
    update_date:Date;
    delflg: boolean;

    //非DB項目
    user_count: Number;
 }
             
 export enum Group1ModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2,
    History = 3,
    GroupEdit = 4
}

export interface IGroup2 {
    group_id: number;
    modify_count1: number;
    user_id: number;
    modify_count2: number;
    update_u_id: number;
    update_date: Date;
    delflg: boolean;
 }
             
 