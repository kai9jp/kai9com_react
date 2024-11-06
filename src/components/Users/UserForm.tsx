import React, { useState, FormEvent, Dispatch, Fragment,useEffect } from "react";
import { IStateType, IUserState,INotificationState } from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import { IUser, UserModificationStatus } from "../../store/models/user.interface";
import TextInput from "../../common/components/TextInput";
import TextArea from "../../common/components/TextArea";
import { editUser, clearSelectedUser, setModificationState, addUser } from "../../store/actions/users.action";
import { addNotification,removeNotification_pre } from "../../store/actions/notifications.action";
import Checkbox from "../../common/components/Checkbox";
import SelectInput from "../../common/components/Select";
import { OnChangeModel, IUserFormState } from "../../non_common/types/Form.types";
import axios from 'axios';
import {API_URL,AUT_STR_NORMAL, AUT_STR_READ_ONLY, AUT_STR_ADMIN, AUT_NUM_ADMIN,
  AUT_NUM_READ_ONLY,REMOVE_NOTIFICATION_SECONDS} from "../../common/constants";
import Swal from 'sweetalert2';
import "./Users.css";
import { logout } from "../../store/actions/account.actions";
// import { useNavigate } from "react-router-dom";
import { IAccount } from "../../store/models/account.interface";
import { login } from "../../store/actions/account.actions";

const UserForm: React.FC = () => {
  //useDispatchとuseSelectorでstate内のusersを宣言し簡易的に割当
  const dispatch: Dispatch<any> = useDispatch();
  const users: IUserState | null = useSelector((state: IStateType) => state.users);
  const [isRevealPassword, setIsRevealPassword] = useState(false);
  const notifications: INotificationState | null = useSelector((state: IStateType) => state.notifications);
  const account: IAccount = useSelector((state: IStateType) => state.account);
  const [group1s, setgroup1s] = useState([""]);
  const [default_g_value, setdefault_g_value] = useState("");
  const [is_find_group1_end, setis_find_group1_end] = useState(false);
  

  //letで再代入が可能な変数を宣言
  //パイプ記号(|)でユニオン型(何れかの型)を宣言
  //デフォルト値にusers.selectedUserの値を設定
  let user: IUser | null = users.selectedUser;

  //constで再代入NGの変数を宣言
  const isCreate: boolean = (users.modificationState === UserModificationStatus.Create);

  //Reactでパスワードの表示と非表示を切り替える
  //https://zenn.dev/dove/articles/cd1eb343a9e76bcd2066
  const togglePassword = () => {
    setIsRevealPassword((prevState) => !prevState);
  }

  const PasswordHint = () => {
    Swal.fire({
      title: 'パスワード変更について',
      html: `<div style="text-align: left;">目のアイコンをクリックすると、現在のパスワードが暗号化形式で表示されます。<br><br>パスワードを更新する際は、新しいパスワードを平文で入力してください。</div>`,
      icon: 'info',
      confirmButtonText: 'OK'
    })
  }
  const PasswordNeedHint = () => {
    Swal.fire({
      title: 'パスワード変更要求について',
      text: "次回ログオン時にパスワードの変更を要求するよう設定します。",
      icon: 'info',
      confirmButtonText: 'OK'
    })
  }

  // const navigate = useNavigate();    

  //ユーザがnullでなく、新規作成の場合、各項目に初期値を設定
  if (!user || isCreate) {
    user = {
            user_id:0,  
            modify_count: 0,
            login_id: "",
            sei: "",
            mei: "",
            sei_kana: "",
            mei_kana: "",
            password: "",
            need_password_change: true,
            mail: "",
            ip: "",
            default_g_id: 0,
            authority_lv: 0,
            note: "",
            update_u_id: 0,
            update_date:new Date,
            delflg: false
           };
  }

  //フォーム変数に値を設定するuseStateを定義
  const [formState, setFormState] = useState({
    user_id: { error: "", value: user.user_id },
    modify_count: { error: "", value: user.modify_count },
    login_id: { error: "", value: user.login_id },
    sei: { error: "", value: user.sei },
    mei: { error: "", value: user.mei },
    sei_kana: { error: "", value: user.sei_kana },
    mei_kana: { error: "", value: user.mei_kana },
    password: { error: "", value: user.password },
    need_password_change: { error: "", value: user.need_password_change },
    mail: { error: "", value: user.mail },
    ip: { error: "", value: user.ip },
    default_g_id: { error: "", value: user.default_g_id },
    authority_lv: { error: "", value: user.authority_lv },
    note: { error: "", value: user.note },
    update_u_id: { error: "", value: user.update_u_id },
    update_date:{ error: "", value: user.update_date },
    delflg: { error: "", value: user.delflg },
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

  async function saveUser(e: FormEvent<HTMLFormElement>) {
  // async function saveUser() {
    //https://qiita.com/yokoto/items/27c56ebc4b818167ef9e
    //event.preventDefaultメソッドは、submitイベントの発生元であるフォームが持つデフォルトの動作をキャンセルするメソッド
    //デフォルトの動作では、現在のURLに対してフォームの送信を行うため、結果的にページがリロードされてしまう。それを防ぐための黒魔術。
    e.preventDefault();
    
    //入力チェックでNGの場合は何もしない
    if (isFormInvalid()) {
      return;
    }

    //変数へ記憶
    let post_user: IUser = {
      user_id: formState.user_id.value,
      modify_count: formState.modify_count.value,
      login_id: formState.login_id.value,
      sei: formState.sei.value,
      mei: formState.mei.value,
      sei_kana: formState.sei_kana.value,
      mei_kana: formState.mei_kana.value,
      password: formState.password.value,
      need_password_change: formState.need_password_change.value,
      mail: formState.mail.value,
      ip: formState.ip.value,
      default_g_id: ConvValueNum(formState.default_g_id.value.toString()),
      authority_lv: ConvValueNum(formState.authority_lv.value.toString()),
      note: formState.note.value,
      update_u_id: formState.update_u_id.value,
      update_date:formState.update_date.value,
      delflg: formState.delflg.value,
    };
    //APIに登録を発行
    const utl =  isCreate? API_URL+'/api/m_user_create': API_URL+'/api/m_user_update';
    if (users){
      //こちらはFormData(x-www-form-urlencoded)モード
      //axios.post(utl, post_user, {withCredentials: true, headers: {'content-type': 'application/x-www-form-urlencoded'} });

      //明示的にpayload(application/json)を指定しないとUTF-8フォーマットになり受信側で失敗する
      await axios.post(utl, post_user, {withCredentials: true, headers: {'content-type': 'application/json'} })
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

        //登録で自動採番されたユーザIDと更新回数を取得する
        formState.user_id.value = response.data.user_id;
        formState.modify_count.value = response.data.modify_count;
        //登録で自動変換された箇所を書き戻す
        formState.sei_kana.value = response.data.sei_kana;
        formState.mei_kana.value = response.data.mei_kana;


        //登録・更新処理に応じ「IAddUserActionType」型の関数を準備
        let saveUserFn: Function = (isCreate) ? addUser : editUser;

        //stateへの反映
        saveForm(formState, saveUserFn);

      })
      .catch(function (error) {
        // 送信失敗時の処理
        //console.log(error);

        Swal.fire({
          title: 'Error!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        })

      });
    }

  }
  
  //[reducerの仕組み]
  //①index.tsxで、APPをProviderで囲いreduxを用いている(ここで定義するstoreに、大量のインターフェーズが実装されている)
  //②rootReducersで、productsやusers等のstateを管理対象として定義している。ここでuserReducer等の関数を紐付て、state(グローバル変数)がdispatch(イベントを発行しstateに変更を反映する)されるように細工している
  //③users.reducer.tsで、userReducerが定義されていて、action.type毎(ADD_USER等)に、stateを更新している
  //上記①②③が、saveFormの実行により功を発し、黒魔術的に何をやってるか意味不明な形で、state反映される
  function saveForm(formState: IUserFormState, saveFn: Function): void {

    if (user) {
      dispatch(saveFn({
        ...user,
        user_id: formState.user_id.value,
        modify_count: formState.modify_count.value,
        login_id: formState.login_id.value,
        sei: formState.sei.value,
        mei: formState.mei.value,
        sei_kana: formState.sei_kana.value,
        mei_kana: formState.mei_kana.value,
        password: formState.password.value,
        need_password_change: formState.need_password_change.value,
        mail: formState.mail.value,
        ip: formState.ip.value,
        default_g_id: ConvValueNum(formState.default_g_id.value.toString()),
        authority_lv: ConvValueNum(formState.authority_lv.value.toString()),
        note: formState.note.value,
        update_u_id: formState.update_u_id.value,
        update_date:formState.update_date.value,
        delflg: formState.delflg.value,
      }));

      dispatch(addNotification("ユーザ", `【${formState.sei.value} ${formState.mei.value}】`+"を登録しました"));
      //10秒後に消す
      setTimeout(function(){if (notifications){dispatch(removeNotification_pre());}},REMOVE_NOTIFICATION_SECONDS);

      //選択ユーザが自分の場合、ログイン管理の各情報を更新する
      if (formState.user_id.value == account.user_id){
        dispatch(login(
          account.user_id, 
          formState.modify_count.value,
          formState.login_id.value,
          ConvValueNum(String(formState.default_g_id.value)),
          ConvValueNum(String(formState.authority_lv.value))
          ));
      }


      dispatch(clearSelectedUser());
      dispatch(setModificationState(UserModificationStatus.None));
    }
  }

    function cancelForm(): void {
      dispatch(setModificationState(UserModificationStatus.None));
    }

    function getDisabledClass(): string {
      let isError: boolean = isFormInvalid();
      return isError ? "disabled" : "";
    }

    //入力チェック
    function isFormInvalid(): boolean {
      return (
           formState.user_id.error 
        || formState.modify_count.error
        || formState.login_id.error 
        || formState.sei.error 
        || formState.mei.error
        || formState.sei_kana.error 
        || formState.mei_kana.error
        || formState.password.error 
        || formState.need_password_change.error
        || formState.mail.error 
        || formState.ip.error
        || formState.default_g_id.error 
        || formState.authority_lv.error
        || formState.note.error 
        || formState.update_u_id.error
        || formState.update_date.error 
        || formState.delflg.error 
        //入力必須
        || !formState.login_id.value
        || !formState.sei.value
        || !formState.mei.value
        || !formState.sei_kana.value
        || !formState.mei_kana.value
        || !formState.password.value
        || !formState.mail.value
        ) as boolean;
  }

  function Set_authority_lv(authority_lv:number): string {
    if (authority_lv===1){return "1:一般"};
    if (authority_lv===2){return "2:参照専用"};
    if (authority_lv===3){return "3:管理者"};
    return "";
  }

  //ユーザ件数検索
  async function m_group1_find_all() {
    const utl = API_URL+'/api/m_group1_find_all';
    await axios.post(utl, {withCredentials: true, headers: {'content-type': 'application/x-www-form-urlencoded'} })

    .then(function (response) {
      //Ractのjson形式に変換(JavaのJsonが届くので)
      const str = JSON.stringify(response.data.results);
      const data = JSON.parse(str);
      setgroup1s(data);
      // for (const str of data) {
      //   let group_id = str.substr(0, str.indexOf(':'));
      //   if (user?.default_g_id == group_id) {
      //     setdefault_g_value(str);
      //   }
      // }
      setis_find_group1_end(true);
    })
    .catch(function (error) {
      // 送信失敗時の処理
      Swal.fire({
        title: 'Error!',
        html: error.message+"<BR>"+error.response.data.msg,
        icon: 'error',
        confirmButtonText: 'OK'
      })
    });
  }

  useEffect(() => {
    if (!is_find_group1_end) {
      m_group1_find_all();
    };

    for (const str of group1s) {
      let group_id = str.substr(0, str.indexOf(':'));
      if (user?.default_g_id.toString() == group_id) {
        setdefault_g_value(str);
      }
    }

  }, [group1s]);
  

  return (
    <Fragment>
      <div className="col-xl-7 col-lg-7">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 id="user_form_header" className="m-0 font-weight-bold text-green">ユーザマスタ {(isCreate ? "新規登録" : "更新 [ユーザID:"+formState.user_id.value)+"]"}</h6>
          </div>
          <div className="card-body">
            <form onSubmit={saveUser} id="user_form">

              <div className="form-row">
                <div className="form-group col-md-6">
                  <TextInput id="login_id"
                    value={formState.login_id.value}
                    field="login_id"
                    onChange={hasFormValueChanged}
                    required={true}
                    minLength={8}
                    maxLength={20}
                    label="ログインID"
                    placeholder="login_id"
                    Pattern_regexp= "^([a-z]*|[A-Z]*|[0-9]*)*$"
                    Pattern_message= "ログインIDは半角英数で入力して下さい"
                    disabled={account.authority_lv == AUT_NUM_READ_ONLY}//参照専用の場合は編集不可
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
                <div className="form-group col-md-6">
                  <TextInput id="sei"
                    value={formState.sei.value}
                    field="sei"
                    onChange={hasFormValueChanged}
                    required={true}
                    maxLength={20}
                    label="姓"
                    placeholder="sei"
                    disabled={account.authority_lv != AUT_NUM_ADMIN}//管理者のみ編集可能(なりすまし予防)
                    />
                </div>
                <div className="form-group col-md-6">
                  <TextInput id="mei"
                    value={formState.mei.value}
                    field="mei"
                    onChange={hasFormValueChanged}
                    required={true}
                    maxLength={20}
                    label="名"
                    placeholder="mei"
                    disabled={account.authority_lv != AUT_NUM_ADMIN}//管理者のみ編集可能(なりすまし予防)
                    />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <TextInput id="sei_kana"
                    value={formState.sei_kana.value}
                    field="sei_kana"
                    onChange={hasFormValueChanged}
                    required={true}
                    maxLength={20}
                    label="セイ"
                    placeholder="sei_kana"
                    Pattern_regexp= "^([\u30A0-\u30FF]|[\u3040-\u309F]|[\uFF61-\uFF9F])*$"
                    Pattern_message= "セイはひらがな、全角カナ・半角カナで入力してください"
                    disabled={account.authority_lv != AUT_NUM_ADMIN}//管理者のみ編集可能(なりすまし予防)
                />
                </div>
                <div className="form-group col-md-6">
                  <TextInput id="mei_kana"
                    value={formState.mei_kana.value}
                    field="mei_kana"
                    onChange={hasFormValueChanged}
                    required={true}
                    maxLength={20}
                    label="メイ"
                    placeholder="mei_kana"
                    //https://www.javadrive.jp/regex-basic/sample/index8.html
                    Pattern_regexp= "^([\u30A0-\u30FF]|[\u3040-\u309F]|[\uFF61-\uFF9F])*$"
                    Pattern_message= "メイはひらがな、全角カナ・半角カナで入力してください"
                    disabled={account.authority_lv != AUT_NUM_ADMIN}//管理者のみ編集可能(なりすまし予防)
                />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <TextInput id="password"
                    type={isRevealPassword ? 'text' : 'password'}
                    value={formState.password.value}
                    field="password"
                    onChange={hasFormValueChanged}
                    required={true}
                    minLength={12}
                    maxLength={60}
                    label="パスワード"
                    placeholder="password" 
                    Pattern_regexp= "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{12,}$"
                    Pattern_message= "大文字、小文字、数字を混在させて下さい"
                  />
                  <i className="fa fa-question-circle PasswordHint" onClick={PasswordHint}></i>
                  <span
                    onClick={togglePassword}
                    role="presentation"
                    className="PasswordReveal"
                  >
                  {isRevealPassword ? (
                    <i className="fas fa-eye" />
                        ) : (
                    <i className="fas fa-eye-slash" />
                        )}
                  </span>
                </div>
                <div className="form-group col-md-6">
                  <br /> 
                  <br /> 
                  <Checkbox
                    id="need_password_change"
                    field="need_password_change"
                    value={formState.need_password_change.value}
                    label="パスワード変更要求"
                    onChange={hasFormValueChanged}
                    disabled={account.authority_lv == AUT_NUM_READ_ONLY}//参照専用の場合は編集不可
                    />
                  <i className="fa fa-question-circle PasswordNeedHint" onClick={PasswordNeedHint}></i>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-12">
                  <TextInput id="mail"
                  field = "mail"
                    value={formState.mail.value}
                    onChange={hasFormValueChanged}
                    required={true}
                    maxLength={200}
                    label="メールアドレス"
                    placeholder="e-mail"
                    // https://www.javadrive.jp/regex-basic/sample/index13.html
                    //Pattern_regexp= "/^[a-zA-Z0-9_+-]+(\.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/"
                    //https://qiita.com/str32/items/a692073af32757618042
                    Pattern_regexp= "[\w\-\._]+@[\w\-\._]+\.[A-Za-z]+"
                    Pattern_message= "メールアドレスが不正です"
                    disabled={account.authority_lv == AUT_NUM_READ_ONLY}//参照専用の場合は編集不可
                 />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-12">
                  <TextInput id="ip"
                  field = "ip"
                    value={formState.ip.value}
                    onChange={hasFormValueChanged}
                    required={false}
                    maxLength={15}
                    label="ipアドレス"
                    placeholder="ip"
                    Pattern_regexp= "^((([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))?$"
                    Pattern_message= "IPアドレスとして正しい形式にしてください"
                    disabled={account.authority_lv == AUT_NUM_READ_ONLY}//参照専用の場合は編集不可
                    />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <SelectInput
                      id="input_default_g_id"
                      field="default_g_id"
                      label="デフォルトグループ"
                      options={group1s}
                      required={true}
                      onChange={hasFormValueChanged}
                      value={default_g_value}
                      disabled={account.authority_lv == AUT_NUM_READ_ONLY}//参照専用の場合は編集不可
                      />
                </div>
                <div className="form-group col-md-6">
                <SelectInput
                      id="input_authority_lv"
                      field="authority_lv"
                      label="権限レベル"
                      options={[AUT_STR_NORMAL, AUT_STR_READ_ONLY, AUT_STR_ADMIN]}
                      required={true}
                      onChange={hasFormValueChanged}
                      value = {Set_authority_lv(formState.authority_lv.value)}
                      disabled={account.authority_lv != AUT_NUM_ADMIN}//管理者のみ編集可能(なりすまし予防)
                      />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-12">
                  <TextArea
                    id="note"
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

              <button type="button" id="cancel_btn" className="btn btn-danger" onClick={() => cancelForm()}>キャンセル</button>
              <button type="submit" id="commit_btn" className={`btn btn-success left-margin ${getDisabledClass()}` }  >登録</button>  
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UserForm;
