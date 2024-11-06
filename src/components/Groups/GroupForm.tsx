import React, { useState, FormEvent, Dispatch, Fragment } from "react";
import { IStateType, IGroup1State,INotificationState } from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import { IGroup1, Group1ModificationStatus } from "../../store/models/group.interface";
import TextInput from "../../common/components/TextInput";
import TextArea from "../../common/components/TextArea";
import { editGroup1, clearSelectedGroup1, setModificationState, addGroup1 } from "../../store/actions/group1s.action";
import { addNotification,removeNotification_pre } from "../../store/actions/notifications.action";
import Checkbox from "../../common/components/Checkbox";
import { OnChangeModel, IGroup1FormState } from "../../non_common/types/Form.types";
import axios from 'axios';
import {API_URL,AUT_NUM_READ_ONLY,REMOVE_NOTIFICATION_SECONDS} from "../../common/constants";
import Swal from 'sweetalert2';
import "./Groups.css";
import { logout } from "../../store/actions/account.actions";
// import { useNavigate } from "react-router-dom";
import { IAccount } from "../../store/models/account.interface";

const GroupForm: React.FC = () => {
  //useDispatchとuseSelectorでstate内のgroupsを宣言し簡易的に割当
  const dispatch: Dispatch<any> = useDispatch();
  const groups: IGroup1State | null = useSelector((state: IStateType) => state.groups);
  const notifications: INotificationState | null = useSelector((state: IStateType) => state.notifications);
  const account: IAccount = useSelector((state: IStateType) => state.account);
  

  //letで再代入が可能な変数を宣言
  //パイプ記号(|)でユニオン型(何れかの型)を宣言
  //デフォルト値にgroups.selectedGroupの値を設定
  let group: IGroup1 | null = groups.selectedGroup;

  //constで再代入NGの変数を宣言
  const isCreate: boolean = (groups.modificationState === Group1ModificationStatus.Create);

  // const navigate = useNavigate();    

  //グループがnullでなく、新規作成の場合、各項目に初期値を設定
  if (!group || isCreate) {
    group = {group_id:0,  modify_count1: 0,  group_name: "",  note: "",  update_u_id: 0,  update_date:new Date,  delflg: false,user_count:0};
  }

  //フォーム変数に値を設定するuseStateを定義
  const [formState, setFormState] = useState({
    group_id: { error: "", value: group.group_id },
    modify_count1: { error: "", value: group.modify_count1 },
    group_name: { error: "", value: group.group_name },
    note: { error: "", value: group.note },
    update_u_id: { error: "", value: group.update_u_id },
    update_date:{ error: "", value: group.update_date },
    delflg: { error: "", value: group.delflg },
  });

  //入力フォームの各項目に対するChangedイベント
  function hasFormValueChanged(model: OnChangeModel): void {
    //各フォーム変数に値やエラー値を格納する
    //...はスプレッド構文(配列の[]を外し分解した状態で渡す)を用い、変更が発生した箇所のstateだけ更新している
    setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } });
  }

  async function saveGroup(e: FormEvent<HTMLFormElement>) {
  // async function saveGroup() {
    //https://qiita.com/yokoto/items/27c56ebc4b818167ef9e
    //event.preventDefaultメソッドは、submitイベントの発生元であるフォームが持つデフォルトの動作をキャンセルするメソッド
    //デフォルトの動作では、現在のURLに対してフォームの送信を行うため、結果的にページがリロードされてしまう。それを防ぐための黒魔術。
    e.preventDefault();
    
    //入力チェックでNGの場合は何もしない
    if (isFormInvalid()) {
      return;
    }

    //変数へ記憶
    let post_group = {
      group_id: formState.group_id.value,
      modify_count1: formState.modify_count1.value,
      group_name: formState.group_name.value,
      note: formState.note.value,
      update_u_id: formState.update_u_id.value,
      update_date:formState.update_date.value,
      delflg: formState.delflg.value,
    };
    //APIに登録を発行
    const utl =  isCreate? API_URL+'/api/m_group1_create': API_URL+'/api/m_group1_update';
    if (groups){
      //こちらはFormData(x-www-form-urlencoded)モード
      //axios.post(utl, post_group, {withCredentials: true, headers: {'content-type': 'application/x-www-form-urlencoded'} });

      //明示的にpayload(application/json)を指定しないとUTF-8フォーマットになり受信側で失敗する
      await axios.post(utl, post_group, {withCredentials: true, headers: {'content-type': 'application/json'} })
      .then(function (response) {
        // 送信成功時の処理

        if (response.data.return_code!==200){
          if (response.data.return_code==2){
            //トークンが無い状態の場合、ログイン画面に遷移させる
            //navigate("/login") 
            //navigate("/#") 
            dispatch(logout());
            return;
          }

          //認証エラー等で弾かれた場合はエラー表示して抜ける
          Swal.fire({
            title: 'Error!',
            text: response.data.msg,
            icon: 'error',
            confirmButtonText: 'OK'
          })
          return;
        }

        //登録で自動採番されたグループIDと更新回数を取得する
        formState.group_id.value = response.data.group_id;
        formState.modify_count1.value = response.data.modify_count1;

        //登録・更新処理に応じ「IAddGroupActionType」型の関数を準備
        let saveGroupFn: Function = (isCreate) ? addGroup1 : editGroup1;

        //stateへの反映
        saveForm(formState, saveGroupFn);

      })
      .catch(function (error) {
        // 送信失敗時の処理
        //console.log(error);

        Swal.fire({
          title: 'Error!',
          html: error.message+"<BR>"+error.response.data.msg,
          icon: 'error',
          confirmButtonText: 'OK'
        })

      });
    }

  }
  
  //[reducerの仕組み]
  //①index.tsxで、APPをProviderで囲いreduxを用いている(ここで定義するstoreに、大量のインターフェーズが実装されている)
  //②rootReducersで、productsやgroups等のstateを管理対象として定義している。ここでgroupReducer等の関数を紐付て、state(グローバル変数)がdispatch(イベントを発行しstateに変更を反映する)されるように細工している
  //③groups.reducer.tsで、groupReducerが定義されていて、action.type毎(ADD_USER等)に、stateを更新している
  //上記①②③が、saveFormの実行により功を発し、黒魔術的に何をやってるか意味不明な形で、state反映される
  function saveForm(formState: IGroup1FormState, saveFn: Function): void {

    if (group) {
      dispatch(saveFn({
        ...group,
        group_id: formState.group_id.value,
        modify_count1: formState.modify_count1.value,
        group_name: formState.group_name.value,
        note: formState.note.value,
        update_u_id: formState.update_u_id.value,
        update_date:formState.update_date.value,
        delflg: formState.delflg.value,
      }));

      dispatch(addNotification("グループ", `【${formState.group_name.value}】`+"を登録しました"));
      //10秒後に消す
      setTimeout(function(){if (notifications){dispatch(removeNotification_pre());}},REMOVE_NOTIFICATION_SECONDS);

      dispatch(clearSelectedGroup1());
      dispatch(setModificationState(Group1ModificationStatus.None));
    }
  }

  function cancelForm(): void {
    dispatch(setModificationState(Group1ModificationStatus.None));
  }

  function getDisabledClass(): string {
    let isError: boolean = isFormInvalid();
    return isError ? "disabled" : "";
  }

  //入力チェック
  function isFormInvalid(): boolean {
    return (
         formState.group_id.error 
      || formState.modify_count1.error
      || formState.group_name.error 
      || formState.note.error 
      || formState.update_u_id.error
      || formState.update_date.error 
      || formState.delflg.error 
      //入力必須
      || !formState.group_name.value
      ) as boolean;
}

  return (
    <Fragment>
      <div className="col-xl-7 col-lg-7">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 id="group1_form_header" className="m-0 font-weight-bold text-green">グループマスタ {(isCreate ? "新規登録" : "更新 [グループID:"+formState.group_id.value)+"]"}</h6>
          </div>
          <div className="card-body">
            <form onSubmit={saveGroup} id="group_form">
              <div className="form-row">
                <div className="form-group col-md-6">
                  <TextInput id="group_name"
                    value={formState.group_name.value}
                    field="group_name"
                    onChange={hasFormValueChanged}
                    required={true}
                    maxLength={40}
                    label="グループ名"
                    placeholder="group_name"
                  />
                </div>
                <div className="form-group col-md-6 ">
                  <br /> 
                  <br /> 
                  <div className="delflg">
                    <Checkbox
                      id="delflg"
                      field="delflg"
                      value={formState.delflg.value}
                      label="削除"
                      onChange={hasFormValueChanged}
                      disabled={account.authority_lv == AUT_NUM_READ_ONLY}//参照専用の場合は編集不可
                      />
                  </div>
                </div>

              </div>
              <div className="form-row">
                <div className="form-group col-md-12">
                  <TextArea
                    id="input_note"
                    field = "note"
                    value={formState.note.value}
                    onChange={hasFormValueChanged}
                    required={false}
                    maxLength={200}
                    label="備考"
                    rows = {4}
                    placeholder="note"
                    disabled={account.authority_lv == AUT_NUM_READ_ONLY}//参照専用の場合は編集不可
                  />
                </div>
              </div>

              <button type="button" className="btn btn-danger" onClick={() => cancelForm()}>キャンセル</button>
              <button type="submit" className={`btn btn-success left-margin ${getDisabledClass()}` }  >登録</button>  
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default GroupForm;
