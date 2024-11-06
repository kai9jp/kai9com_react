export interface IServer {
    server_id: number;
    modify_count: number;
    host_name: string;
    ip: string;
    note: string;
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