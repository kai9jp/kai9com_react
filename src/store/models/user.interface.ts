export interface IUser {
    user_id: number;
    modify_count: number;
    login_id: string;
    sei: string;
    mei: string;
    sei_kana: string;
    mei_kana: string;
    password: string;
    need_password_change: boolean;
    mail: string;
    ip: string;
    default_g_id: number;
    authority_lv: number;
    note: string;
    update_u_id: number;
    update_date:Date;
    delflg: boolean;
 }
             
 export enum UserModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2,
    History = 3
}