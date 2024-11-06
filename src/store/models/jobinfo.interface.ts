export interface IJobinfo {
    jobinfo_id: number;
    modify_count: number;
    job_name: string;
    unit_full_name: string;
    last_exec_datetime: Date;
    next_exec_datetime: Date;
    note: string;
    update_u_id: number;
    update_date:Date;
    delflg: boolean;
    server_count: Number;
 }
             
 export enum JobinfoModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2,
    History = 3,
    JobServersEdit = 4
}