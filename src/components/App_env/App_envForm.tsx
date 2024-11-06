import React, { useState, FormEvent, Dispatch, Fragment,useEffect } from "react";
import { IStateType, IApp_envState,INotificationState } from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import { IApp_env, App_envModificationStatus } from "../../store/models/app_env.interface";
import TextInput from "../../common/components/TextInput";
import TextArea from "../../common/components/TextArea";
import NumberInput from "../../common/components/NumberInput";
import { addNotification,removeNotification_pre } from "../../store/actions/notifications.action";
import { OnChangeModel } from "../../non_common/types/Form.types";
import {AUT_NUM_ADMIN,REMOVE_NOTIFICATION_SECONDS} from "../../common/constants";
import { IAccount } from "../../store/models/account.interface";
import { callApi } from "../../common/comUtil";
import Swal from "sweetalert2";
import styles from "./App_env.module.css";

export type App_envFormProps = {
  FindApp_env:any
  historyButton:any
}
const App_envForm = (props:App_envFormProps) =>  {
  //useDispatchとuseSelectorでstate内のApp_envsを宣言し簡易的に割当
  const dispatch: Dispatch<any> = useDispatch();
  const App_envs: IApp_envState | null = useSelector((state: IStateType) => state.App_envs);
  const notifications: INotificationState | null = useSelector((state: IStateType) => state.notifications);
  const account: IAccount = useSelector((state: IStateType) => state.account);
  const [isRevealPassword, setIsRevealPassword] = useState(false);
  

  //letで再代入が可能な変数を宣言
  //パイプ記号(|)でユニオン型(何れかの型)を宣言
  //デフォルト値にApp_envs.selectedApp_envの値を設定
  let App_env: IApp_env | null = App_envs.App_env;

  //constで再代入NGの変数を宣言
  const isCreate: boolean = (App_envs.modificationState === App_envModificationStatus.Create);


  //nullでなく、新規作成の場合、各項目に初期値を設定
  if (!App_env || isCreate) {
    App_env = {
      modify_count:0,
      dir_tmp:"",
      del_days_tmp:0,
      svn_react_dir:"",
      svn_spring_dir:"",
      svn_scenario_dir:"",
      svn_testdata_dir:"",
      svn_react_url:"",
      svn_spring_url:"",
      svn_scenario_url:"",
      svn_testdata_url:"",
      svn_id:"",
      svn_pw:"",
      update_u_id:0,
      update_date:new Date
};
  }


  //フォーム変数に値を設定するuseStateを定義
  const [formState, setFormState] = useState({
    modify_count: { error: "", value: App_env.modify_count },
    dir_tmp: { error: "", value: App_env.dir_tmp },
    del_days_tmp: { error: "", value: App_env.del_days_tmp },
    svn_react_dir: { error: "", value: App_env.svn_react_dir },
    svn_spring_dir: { error: "", value: App_env.svn_spring_dir },
    svn_scenario_dir: { error: "", value: App_env.svn_scenario_dir },
    svn_testdata_dir: { error: "", value: App_env.svn_testdata_dir },
    svn_react_url: { error: "", value: App_env.svn_react_url },
    svn_spring_url: { error: "", value: App_env.svn_spring_url },
    svn_scenario_url: { error: "", value: App_env.svn_scenario_url },
    svn_testdata_url: { error: "", value: App_env.svn_testdata_url },
    svn_id: { error: "", value: App_env.svn_id },
    svn_pw: { error: "", value: App_env.svn_pw },
    update_u_id: { error: "", value: App_env.update_u_id },
    update_date: { error: "", value: App_env.update_date },
  });

  //入力フォームの各項目に対するChangedイベント
  function hasFormValueChanged(model: OnChangeModel): void {
    //各フォーム変数に値やエラー値を格納する
    //...はスプレッド構文(配列の[]を外し分解した状態で渡す)を用い、変更が発生した箇所のstateだけ更新している
    setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } });
  }

  //セレクトボックスの数値箇所だけを取り出す
  function ConvValueNum(str:String):number{
    if (str.indexOf(':') === -1){
      return Number(str);
    }else{
      var cut1 =str.substr(0, str.indexOf(':'));
      return Number(cut1);
    }
  }

  async function saveApp_env(e: FormEvent<HTMLFormElement>) {
    //デフォルトの動作では、現在のURLに対してフォームの送信を行うため、結果的にページがリロードされてしまう。それを防ぐための黒魔術。
    e.preventDefault();
    
    //入力チェックでNGの場合は何もしない
    if (isFormInvalid()) {
      return;
    }

    //変数へ記憶
    let post_App_env: IApp_env = {
      modify_count: formState.modify_count.value,
      dir_tmp: formState.dir_tmp.value,
      del_days_tmp: formState.del_days_tmp.value,
      svn_react_dir: formState.svn_react_dir.value,
      svn_spring_dir: formState.svn_spring_dir.value,
      svn_scenario_dir: formState.svn_scenario_dir.value,
      svn_testdata_dir: formState.svn_testdata_dir.value,
      svn_react_url: formState.svn_react_url.value,
      svn_spring_url: formState.svn_spring_url.value,
      svn_scenario_url: formState.svn_scenario_url.value,
      svn_testdata_url: formState.svn_testdata_url.value,
      svn_id: formState.svn_id.value,
      svn_pw: formState.svn_pw.value,
      update_u_id: formState.update_u_id.value,
      update_date: formState.update_date.value,
    };
    //APIに登録を発行
    if (App_envs){
      const response = await callApi('app_env_update', post_App_env,'application/json');
      if (response){
        // 送信成功時の処理

        dispatch(addNotification("環境マスタ", "登録しました"));
        //10秒後に消す
        setTimeout(function(){if (notifications){dispatch(removeNotification_pre());}},REMOVE_NOTIFICATION_SECONDS);
  
        //親画面の検索をコール
        props.FindApp_env();
      }
    }

  }
  
    function getDisabledClass(): string {
      let isError: boolean = isFormInvalid();
      return isError ? "disabled" : "";
    }

    //入力チェック
    function isFormInvalid(): boolean {
      return (
        formState.modify_count.error 
        || formState.dir_tmp.error
        || formState.del_days_tmp.error
        || formState.svn_react_dir.error
        || formState.svn_spring_dir.error
        || formState.svn_scenario_dir.error
        || formState.svn_testdata_dir.error
        || formState.svn_react_url.error
        || formState.svn_spring_url.error
        || formState.svn_scenario_url.error
        || formState.svn_testdata_url.error
        || formState.svn_id.error
        || formState.svn_pw.error
        || formState.update_u_id.error
        || formState.update_date.error
      ) as unknown as boolean;
  }

  function makeTextArea(label:string,value:string,id:string) :JSX.Element {
    return(
      <TextArea
        id={id}
        field = {id}
        value={value}
        onChange={hasFormValueChanged}
        required={false}
        maxLength={300}
        label={label}
        rows = {1}
        cols = {120}
        placeholder={id}
        disabled={account.authority_lv != AUT_NUM_ADMIN}//参照専用の場合は編集不可
      />
    )
  }
  
  function makeTextInput(label:string,value:string,id:string,maxLength:number) :JSX.Element {
    return(
      <TextInput id={id}
        value={value}
        field={id}
        onChange={hasFormValueChanged}
        required={false}
        maxLength={maxLength}
        label={label}
        placeholder={id}
        disabled={account.authority_lv != AUT_NUM_ADMIN}//参照専用の場合は編集不可
      />
    )
  }

  function makeNumberInput(label:string,value:number,id:string) :JSX.Element {
    return(
      <div style={{ display: 'flex', alignItems: 'center'}}>
        <div style={{ flexBasis: '30%', textAlign: 'left' }}>
          <label htmlFor={id}>{label}</label>
        </div>
        <div style={{ flexBasis: '30%' }}>
          <NumberInput
            id={id}
            field={id}
            value={value}
            onChange={hasFormValueChanged}
            disabled={account.authority_lv != AUT_NUM_ADMIN} //参照専用の場合は編集不可
          />
        </div>
    </div>                
    )
  }

  //Reactでパスワードの表示と非表示を切り替える
  const togglePassword = () => {
    setIsRevealPassword((prevState) => !prevState);
  }

  const PasswordHint = () => {
    Swal.fire({
      title: 'パスワード変更について',
      text: "登録済パスワードが暗号化された状態で入っています。変更したい場合、新しいパスワードで全て上書きして下さい。",
      icon: 'info',
      confirmButtonText: 'OK'
    })
  }

  //------------------------------------------------------------------
  //DB取得データの画面反映
  //------------------------------------------------------------------
  // FormField型は、オブジェクトの各キーに対応する値とエラーメッセージを持つオブジェクトです。
  type FormField<T> = {
    [key in keyof T]: { error: string; value: T[key] };
  };
  // IApp_env型を、formstate型に変換
  const transformApp_env = (App_env: IApp_env): FormField<IApp_env> => {
    const result: any = {};
    // App_envオブジェクトの各キーに対してループ処理
    for (const key of Object.keys(App_env) as (keyof IApp_env)[]) {
      // resultオブジェクトに、エラーメッセージと値を持つオブジェクトを追加
      result[key] = { error: "", value: App_env[key] };
    }
    // 変換されたresultオブジェクトを返す
    return result;
  };
  //App_envs.App_envをformStateに反映
  useEffect(() => {
    if (App_envs.App_env) {
      setFormState(transformApp_env(App_envs.App_env));
    }
  }, [App_envs.App_env]); 

  return (
    <Fragment>
      <div className="col-xl-7 col-lg-7">
        <div className="card shadow mb-4">
          <div className="card-header py-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h6 id="App_env_form_header" className="m-0 font-weight-bold text-green">環境マスタ {(isCreate ? "新規登録" : "更新[更新回数:"+formState.modify_count.value)+"]"}</h6>
            {props.historyButton}
          </div>
          <div className="card-body">
            <form onSubmit={saveApp_env} id="App_env_form">

              <div className="form-group" style={{width:"100%"}}>

                <span className={styles.blueBoldText}>共通設定</span>
                <br /> 
                <br /> 
                {makeTextArea("一時フォルダ",formState.dir_tmp.value,"dir_tmp")}
                <br /> 

                {makeNumberInput("一時フォルダ保持日",formState.del_days_tmp.value,"del_days_tmp")}

                <br /> 
                <hr /> 
                <span className={styles.blueBoldText}>ソース自動生成用(kai9templ格納先)</span>
                <br /> 
                <br /> 
                
                {makeTextArea("SVNフォルダ(React)",formState.svn_react_dir.value,"svn_react_dir")}
                <br /> 

                {makeTextArea("SVNフォルダ(Spring)",formState.svn_spring_dir.value,"svn_spring_dir")}
                <br /> 

                {makeTextArea("SVNフォルダ(シナリオ)",formState.svn_scenario_dir.value,"svn_scenario_dir")}
                <br /> 

                {makeTextArea("SVNフォルダ(テストデータ)",formState.svn_testdata_dir.value,"svn_testdata_dir")}
                <br /> 

                {makeTextArea("SVN:URL(React)",formState.svn_react_url.value,"svn_react_url")}
                <br /> 

                {makeTextArea("SVN:URL(Spring)",formState.svn_spring_url.value,"svn_spring_url")}
                <br /> 

                {makeTextArea("SVN:URL(シナリオ)",formState.svn_scenario_url.value,"svn_scenario_url")}
                <br /> 

                {makeTextArea("SVN:URL(テストデータ)",formState.svn_testdata_url.value,"svn_testdata_url")}
                <br /> 

                {makeTextArea("SVN:ID",formState.svn_id.value,"svn_id")}
                <br /> 

                <div className="form-group col-md-6">
                  <TextInput id="password"
                    type={isRevealPassword ? 'text' : 'password'}
                    value={formState.svn_pw.value}
                    field="svn_pw"
                    onChange={hasFormValueChanged}
                    required={true}
                    maxLength={0}
                    label="パスワード"
                    placeholder="svn_pw" 
                  />
                  <i className="fa fa-question-circle PasswordHint" onClick={PasswordHint}></i>
                  <span
                    onClick={togglePassword}
                    role="presentation"
                    className={styles.PasswordReveal}
                  >
                  {isRevealPassword ? (
                    <i className="fas fa-eye" />
                        ) : (
                    <i className="fas fa-eye-slash" />
                        )}
                  </span>
                </div>


                <br /> 
              </div>

              {account.authority_lv != AUT_NUM_ADMIN? null:
                // アドミン権限の場合だけ登録ボタンが押せる
                <button type="submit" className={`btn btn-success left-margin ${getDisabledClass()}` }  >登録</button>  
              }
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  )
};

export default App_envForm;
