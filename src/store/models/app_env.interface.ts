export interface IApp_env {
    modify_count: number;
    dir_tmp: string;
    del_days_tmp: number;
    svn_react_dir: string;
    svn_spring_dir: string;
    svn_scenario_dir: string;
    svn_testdata_dir: string;
    svn_react_url: string;
    svn_spring_url: string;
    svn_scenario_url: string;
    svn_testdata_url: string;
    svn_id: string;
    svn_pw: string;
    update_u_id: number;
    update_date: Date;
}    

export enum App_envModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2,
    History = 3
}
