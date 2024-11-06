export interface IJobServer {
    jobinfo_id: number;
    server_id: number;
    modify_count: number;
    update_u_id: number;
    update_date:Date;
    delflg: boolean;
 }
             
 export enum ServerModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2,
    History = 3
}