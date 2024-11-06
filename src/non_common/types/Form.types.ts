import { IProduct } from "../../store/models/product.interface";

export type OnChangeModel = {
    value: string | number | boolean,
    error: string,
    touched: boolean,
    field: string
};

export interface IFormStateField<T> {error: string, value: T};

export interface IProductFormState {
    name: IFormStateField<string>;
    description: IFormStateField<string>;
    amount: IFormStateField<number>;
    price: IFormStateField<number>;
    hasExpiryDate: IFormStateField<boolean>; 
    category: IFormStateField<string>;
};

export  interface IOrderFormState {
    name: IFormStateField<string>;
    product: IFormStateField<IProduct | null>;
    amount: IFormStateField<number>;
    totalPrice: IFormStateField<number>;
};

export interface IUserFormState {
    user_id: IFormStateField<number>;
    modify_count: IFormStateField<number>;
    login_id: IFormStateField<string>;
    sei: IFormStateField<string>;
    mei: IFormStateField<string>;
    sei_kana: IFormStateField<string>;
    mei_kana: IFormStateField<string>;
    password: IFormStateField<string>;
    need_password_change: IFormStateField<boolean>; 
    mail: IFormStateField<string>;
    ip: IFormStateField<string>;
    default_g_id: IFormStateField<number>;
    authority_lv: IFormStateField<number>;
    note: IFormStateField<string>;
    update_u_id: IFormStateField<number>;
    update_date:IFormStateField<Date>;
    delflg: IFormStateField<boolean>; 
};

export interface IGroup1FormState {
    group_id: IFormStateField<number>;
    modify_count1: IFormStateField<number>;
    group_name: IFormStateField<string>;
    note: IFormStateField<string>;
    update_u_id: IFormStateField<number>;
    update_date:IFormStateField<Date>;
    delflg: IFormStateField<boolean>; 
};

export interface IApp_envFormState {
    modify_count: IFormStateField<number>;
    dir_tmp: IFormStateField<string>;
    del_days_tmp: IFormStateField<number>;
    svn_react_dir: IFormStateField<string>;
    svn_spring_dir: IFormStateField<string>;
    svn_react_url: IFormStateField<string>;
    svn_spring_url: IFormStateField<string>;
    update_u_id: IFormStateField<number>;
    update_date: IFormStateField<Date>;
};
