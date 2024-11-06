import React, { Fragment, Dispatch, useState, useEffect} from "react";
import TopCard from "../../common/components/TopCard";
import { IUser,UserModificationStatus } from "../../store/models/user.interface";
import { useDispatch, useSelector } from "react-redux";
import { IStateType,IUserState,IGroup1State,INotificationState } from "../../store/models/root.interface";
import { ClearUser,addUser, editUser,setModificationState,changeSelectedUser, removeUser, 
  clearSelectedUser,setAllCount,setAdminCount,setNormalCount,setReadonlyCount,
  ClearUserhistory,addUserHistory} from "../../store/actions/users.action";
 import { updateCurrentPath } from "../../store/actions/root.actions";
import { SetnumberOfDisplaysPerpage } from "../../store/actions/userspagenation.action";
import UserForm from "./UserForm";
import UserList from "./UsersList";
import UserHistoryList from "./UserHistoryList";
import axios from 'axios';
import {API_URL,AUT_NUM_ADMIN,AUT_NUM_READ_ONLY,REMOVE_NOTIFICATION_SECONDS} from "../../common/constants";
import { addNotification,removeNotification_pre } from "../../store/actions/notifications.action";
import "./Users.css";
import Pagination from '../Pagination/Pagination';
import NumberInput from "../../common/components/NumberInput";
import { OnChangeModel } from "../../non_common/types/Form.types";
import Swal from 'sweetalert2';
import { logout } from "../../store/actions/account.actions";
import { IAccount } from "../../store/models/account.interface";
import { Group1ModificationStatus } from "../../store/models/group.interface";
import { addGroup2,removeGroup2 } from "../../store/actions/group1s.action";
import { SetCurrentPage } from "../../store/actions/userspagenation.action";

export type usersProps = {
  onGroup2post?: () => void;
  group_name?:string;
  children?: React.ReactNode;
};

function Users(props: usersProps): JSX.Element  {
  const dispatch: Dispatch<any> = useDispatch();
  const users: IUserState = useSelector((state: IStateType) => state.users);
  const UserPagenationState = useSelector((state: IStateType) => state.userspagenation);
  dispatch(updateCurrentPath("user", "list"));
  const account: IAccount = useSelector((state: IStateType) => state.account);
  const groups: IGroup1State = useSelector((state: IStateType) => state.groups);
  const notifications: INotificationState | null = useSelector((state: IStateType) => state.notifications);

  //これらstateの初期化はページが遷移する度に行われる
  const [findStr, setfindStr] = useState("");
  const [findStrCommit, setfindStrCommit] = useState("");
  const [isDelDataShow, setisDelDataShow] = useState(false);
  const [is_group_edit_mode, setis_group_edit_mode] = useState(false);
  //ユーザフォーム表示用
  const [isContentOpen, setIsContentOpen] = useState(false);
  //ユーザ履歴表示用
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);


  function onUserSelect(User: IUser): void {
    dispatch(changeSelectedUser(User));
    if (!is_group_edit_mode){
      dispatch(setModificationState(UserModificationStatus.None));
      setIsContentOpen(false);
    }
  }

  function onUserChecked(User: IUser,checked: boolean): void {
    if (is_group_edit_mode){
      if (checked) dispatch(addGroup2(User.user_id));
      else dispatch(removeGroup2(User.user_id));
    }
  }

  const isDelDataShowHint = () => {
    Swal.fire({
      title: '「削除」スイッチについて',
      text: "ONにする事で削除済データも表示します。",
      icon: 'info',
      confirmButtonText: 'OK'
    })
  }

  async function UserRemove() {
    const utl =  API_URL+'/api/m_user_delete';
    await axios.post(utl, users.selectedUser, {withCredentials: true, headers: {'content-type': 'application/json'} })
    .then(function (response) {
      // 送信成功時の処理
      if (response.data.return_code!==200){
        if (response.data.return_code==2){
          //トークンが無い状態の場合、ログイン画面に遷移させる
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
      //お知らせを出す
      if(users.selectedUser) {
        let msg = users.selectedUser.delflg ? 'の削除を取り消しました' : 'を削除しました';

        dispatch(addNotification("ユーザ", `【${users.selectedUser.sei} ${users.selectedUser.mei}】`+msg));
        //10秒後に消す
        setTimeout(function(){if (notifications){dispatch(removeNotification_pre());}},REMOVE_NOTIFICATION_SECONDS);

        //反転した後、削除になる場合、表示対象から除外する
        if (!users.selectedUser.delflg　&& !isDelDataShow){
          dispatch(removeUser(users.selectedUser.user_id));
        }

        //登録後の各値をリデュースへ反映
        users.selectedUser.modify_count = response.data.modify_count;
        users.selectedUser.delflg = !users.selectedUser.delflg;
        dispatch(editUser(users.selectedUser));

      }
      dispatch(clearSelectedUser());
    })
  }

  function onUserRemove() {
    if(users.selectedUser) {
      let msg = users.selectedUser.delflg ? '削除を取り消しますか？' : '削除しますか？';
      Swal.fire({
        title: msg,
        icon: 'warning',
        showDenyButton: true,
        confirmButtonText: 'はい',
        denyButtonText: 'いいえ',
      }).then((result) => {
        if (result.isConfirmed) {
          // ユーザ削除処理
          UserRemove();
        } else if (result.isDenied) {
          Swal.fire('削除を取り消しました', '', 'info')
        }
      })  
    }
  }

  //ユーザを検索(ページネーション)
  async function FindUser() {
    const utl = API_URL+'/api/m_user_find';
    const data = { limit: UserPagenationState.numberOfDisplaysPerpage,
                  offset: (UserPagenationState.CurrentPage-1)*UserPagenationState.numberOfDisplaysPerpage,
                  findstr:findStrCommit,
                  isDelDataShow:isDelDataShow
                 };
    //「application/x-www-form-urlencoded」はURLエンコードした平文での送信
    await axios.post(utl, data, {withCredentials: true, headers: {'content-type': 'application/x-www-form-urlencoded'} })

    .then(function (response) {

      //全ユーザを初期化
      dispatch(ClearUser());

      //ノーヒット時はnullが返るので抜ける
      if (!response.data){return}

      //エラー発生時は抜ける
      if (response.data.return_code && response.data.return_code!=0){
        Swal.fire({
          title: 'Error!',
          text: response.data.msg,
          icon: 'error',
          confirmButtonText: 'OK'
        })
        return;
      }
      
      //Ractのjson形式に変換(JavaのJsonが届くので)
      const str = JSON.stringify(response.data);
      //jsonを変換
      let user_array: Array<IUser> = JSON.parse(str);
      
      if (user_array){
        const flg_group_edit_mode = groups.modificationState === Group1ModificationStatus.GroupEdit && !window.location.href.match("/users");
        //管理者ユーザ以外は、自分しか見えないようにする(グループ編集モード時を除く)
        if (account.authority_lv != AUT_NUM_ADMIN && !flg_group_edit_mode){
          const user_array2: Array<IUser>  = user_array.filter(n => n.user_id == account.user_id);
          user_array = user_array2;
        }
        //map関数は、指定したコールバック関数を配列の要素数分繰り返す(valueは引数であり、配列の各要素が入ってくる)
        //ここでは、配列の要素数だけaddAdminしている
        if (user_array){
          user_array.map(value => (dispatch(addUser(value))));
        }
      }
    })
    .catch(function (error) {
      // 送信失敗時
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      })
    });
  }

  async function onUserHistory() {
    if(users.selectedUser) {
      await FindUserHistory(users.selectedUser.user_id);
      setIsHistoryOpen(true);
      dispatch(setModificationState(UserModificationStatus.History));
    }
  }

  async function FindUserHistory(user_id:number) {
    const utl = API_URL+'/api/m_user_history_find';
    const data = { user_id: user_id};
    //「application/x-www-form-urlencoded」はURLエンコードした平文での送信
    await axios.post(utl, data, {withCredentials: true, headers: {'content-type': 'application/x-www-form-urlencoded'} })

    .then(function (response) {

      //全履歴を初期化
     dispatch(ClearUserhistory());
      
      //Ractのjson形式に変換(JavaのJsonが届くので)
      const str = JSON.stringify(response.data);
      //jsonを変換
      let user_array: Array<IUser> = JSON.parse(str);
      
      //map関数は、指定したコールバック関数を配列の要素数分繰り返す(valueは引数であり、配列の各要素が入ってくる)
      //ここでは、配列の要素数だけaddAdminしている
      if (user_array){
        user_array.map(value => (dispatch(addUserHistory(value))));
      }
    })
    .catch(function (error) {
      // 送信失敗時
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      })
    });
  }


  //件数検索
  async function m_user_count() {
    const utl = API_URL+'/api/m_user_count';
    await axios.post(utl, {findstr: findStrCommit,isDelDataShow:isDelDataShow},{withCredentials: true, headers: {'content-type': 'application/x-www-form-urlencoded'} })

    .then(function (response) {
      //Ractのjson形式に変換(JavaのJsonが届くので)
      const str = JSON.stringify(response.data);
      const data = JSON.parse(str);
      dispatch(setAllCount(data.all_count));
      dispatch(setNormalCount(data.admin_count));
      dispatch(setAdminCount(data.normal_count));
      dispatch(setReadonlyCount(data.readonly_count));
      FindUser();
    })
    .catch(function (error) {
      // 送信失敗時の処理
      console.log(error);
    });
  }

//表示件数設定
function hasFormValueChanged(model: OnChangeModel): void {
  dispatch(SetnumberOfDisplaysPerpage(Number(model.value)));
}

let CurrentPage = 0;
useEffect(() => {
  //一覧検索
  m_user_count();

  CurrentPage = UserPagenationState.CurrentPage;

    //入力フォームの表示位置までスクロールする
    //https://blog.usize-tech.com/vertical-scroll-by-react/
    if (isContentOpen) {
      const checkElement = () => {
        const headerElement = document.getElementById("user_form_header");
        if (headerElement) {
          headerElement.scrollIntoView({ behavior: "smooth", block: "center" });
          setIsContentOpen(false);
        } else {
          //非同期処理により画面表示が遅れるので、最大2秒待つ
          setTimeout(checkElement, 100); // 100ms後に再試行
        }
      };
      setTimeout(checkElement, 100); // 初回実行
      setTimeout(() => setIsContentOpen(false), 2000); // 2秒後に強制終了
    }    

  
  //履歴の表示位置までスクロールする
  if (isHistoryOpen) {
    if (document.getElementById("user_history_header")){
      document.getElementById("user_history_header")!.scrollIntoView({behavior:"smooth",block:"center"});
      setIsHistoryOpen(false);
    }
  };

  //グループ編集モードの判定(/usersの場合はNO判定)
  setis_group_edit_mode(groups.modificationState === Group1ModificationStatus.GroupEdit && !window.location.href.match("/users"));

}, [isContentOpen,UserPagenationState,UserPagenationState.numberOfDisplaysPerpage,findStrCommit,isDelDataShow,users.selectedUser,isHistoryOpen,groups.modificationState]);


return (
    <Fragment>
      
        {(!is_group_edit_mode)?//グループ変更モードの場合は非表示
          <div>
            <h1 className="h3 mb-2 text-gray-800">ユーザマスタ</h1>
            <p className="mb-4">管理画面</p>
          </div>
          :null
        }
        {(!is_group_edit_mode)?//グループ変更モードの場合は非表示
          <div className="row">
            {/* 仕組みは不明だがアイコンは → https://johobase.com/font-awesome-icon-font-list-free/ */}
            { (account.authority_lv == AUT_NUM_ADMIN && users.admin_count)?// 権限が管理者の場合だけ表示する
              <TopCard title="管理者" text={users.admin_count.toString()} icon="user-tie" class="primary" />
              :""
            }
            { (account.authority_lv == AUT_NUM_ADMIN && users.normal_count)?
              <TopCard title="一般" text={users.normal_count.toString()} icon="user" class="danger" />
              :""
            }
            { (account.authority_lv == AUT_NUM_ADMIN && users.readonly_count)?
              <TopCard title="参照専用" text={users.readonly_count.toString()} icon="user-shield" class="secondary" />
              :""
            }
          </div>
        :null}

        <div className="row">
          <div className="col-xl-12 col-lg-12">
            <div className="card shadow mb-4">
              <div className="card-header py-3" id="Users_header">

                <div className="row">

                  { (!is_group_edit_mode)?
                    // グループ変更モードではない場合
                    <h6 className="mt-3 font-weight-bold text-green col-md-5 ">ユーザ一覧({users.all_count}件)</h6>
                    //グループ変更モードの場合
                  : <h6 className="mt-3 font-weight-bold text-green col-md-5 ">ユーザ一覧({users.all_count}件) 【グループ名:{props.group_name}】</h6> 
                  }

                  <div className="col-md-4 ">
                    { (account.authority_lv == AUT_NUM_ADMIN)?// 権限が管理者の場合だけ表示する
                      <div className="input-group mt-2">
                        <input type="text" className="form-control" id="keyword_find_input" placeholder="キーワード検索" aria-label="キーワード検索" aria-describedby="button-addon2"onChange={(event) => setfindStr(event.target.value)}/>
                        <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={()=> dispatch(setfindStrCommit(findStr))}>検索</button>
                      </div>
                      :""
                    }
                  </div>

                  {(is_group_edit_mode && account.authority_lv == AUT_NUM_ADMIN)?//グループ変更モードの場合、保存ボタンを表示(権限が管理者の場合だけ)
                    <div className="col-md-3 ">
                      <div className="header-buttons">
                        <button className="btn btn-success btn-blue" onClick={() => {
                              if(props.onGroup2post) props.onGroup2post();
                            }}>
                              <i className="fas fa fas fa-save" title="登録"></i>
                          </button>
                      </div>
                    </div>
                    :null
                  }

                  {(!is_group_edit_mode)?//グループ変更モードの場合は非表示
                  <div className="col-md-3 ">
                    <div className="header-buttons">
                      { (account.authority_lv == AUT_NUM_ADMIN)?
                        // 権限が管理者の場合だけ追加ボタンを表示する
                        <button 
                          id = "user_add_button"
                          className="btn btn-success btn-green" onClick={() =>{
                            setIsContentOpen(true);
                            dispatch(setModificationState(UserModificationStatus.Create));
                          }}
                         >
                          <i className="fas fa fa-user-plus" title="追加"></i>
                        </button>
                      :""
                      }
                      <button 
                        id = "user_edit_button"
                        className="btn btn-success btn-blue" onClick={() => {
                          setIsContentOpen(true);
                          dispatch(setModificationState(UserModificationStatus.Edit));
                        }}
                      >
                          <i className="fas fa fa-user-edit" title="変更"></i>
                      </button>
                      {/* 参照専用以外の場合だけ削除ボタンを表示する */}
                      { (account.authority_lv != AUT_NUM_READ_ONLY)?
                        <button 
                          id = "user_del_button"
                          className="btn btn-success btn-red"
                          onClick={() => onUserRemove()}
                        >
                            <i className="fas fa fa-user-minus" title="削除"></i>
                        </button>
                        :""
                      }
                      { (account.authority_lv == AUT_NUM_ADMIN)?
                        // 権限が管理者の場合だけ履歴ボタンを表示する
                        <button 
                          id = "user_histry_button"
                          className="btn btn-success btn-black" 
                          onClick={() => onUserHistory()}
                        >
                        <i className="fas fa-history" title="履歴"></i>
                        </button>
                      :""
                      }
                    </div>
                  </div>
                  :null
                }
              
                </div>

              </div>
              <div className="card-body">
                <UserList
                    onSelect={onUserSelect}
                    onUserChecked={onUserChecked}
                  />
              </div>

              {/* ページネーション */}
              { (account.authority_lv == AUT_NUM_ADMIN)?// 権限が管理者の場合だけ表示する

                <div className="card-footer pt-3">
                  <div className="row">
                    <div className="col-md-2 pt-2">
                      <div className="form-check form-switch">
                      {isDelDataShow ? 
                        <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" checked onClick={() => setisDelDataShow(false)}/>
                      :<input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" onClick={() => setisDelDataShow(true)} /> 
                      }
                        <label className="form-check-label" >削除</label>
                        <i className="fa fa-question-circle isDelDataShowHint" onClick={isDelDataShowHint}></i>
                      </div>
                    </div>

                    <div className="col-md-2 pt-2 text-right">
                      <label>表示件数</label>
                    </div>

                    <div className="form-group col-md-2">
                      <NumberInput id="numberOfDisplaysPerpage"
                          value={UserPagenationState.numberOfDisplaysPerpage}
                          field="numberOfDisplaysPerpage"
                          onChange={hasFormValueChanged}
                          max={200}
                          min={0}
                          label=""
                          is_need_ValidCheck={false}
                      />
                    </div>

                    <div className="col-md-6">
                      <Pagination
                        SetCurrentPage={SetCurrentPage}
                        numberOfDisplaysPerpage={UserPagenationState.numberOfDisplaysPerpage} //1ページの表示件数
                        dataCounts={users.all_count} //総件数数
                        currentPage={CurrentPage} //現在の表示ページ
                      />
                    </div>
                  </div>

                </div>

              :""
              }
            </div>
          </div>

          {((users.modificationState === UserModificationStatus.Create)
            || (users.modificationState === UserModificationStatus.Edit && users.selectedUser)) ?
            <UserForm /> : null
          }

          {(users.modificationState === UserModificationStatus.History)?
            <UserHistoryList /> : null
          }

        </div>

    </Fragment >
  );
};

export default Users;
