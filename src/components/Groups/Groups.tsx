import React, { Fragment, Dispatch, useState, useEffect,lazy} from "react";
import { IGroup1,IGroup2,Group1ModificationStatus } from "../../store/models/group.interface";
import { useDispatch, useSelector } from "react-redux";
import { IStateType,IGroup1State,INotificationState } from "../../store/models/root.interface";
import { ClearGroup1,addGroup1, editGroup1,setModificationState,changeSelectedGroup1, removeGroup1, 
  clearSelectedGroup1,setAllCount,ClearGroup1history,addGroup1History,ClearGroup2,setDataGroup2,
  updateGroup2} from "../../store/actions/group1s.action";
 import { updateCurrentPath } from "../../store/actions/root.actions";
import { SetnumberOfDisplaysPerpage } from "../../store/actions/groupspagenation.action";
import GroupForm from "./GroupForm";
import GroupList from "./GroupList";
import GroupHistoryList from "./GroupHistoryList";
import axios from 'axios';
import {API_URL,AUT_NUM_ADMIN,REMOVE_NOTIFICATION_SECONDS} from "../../common/constants";
import { addNotification,removeNotification_pre } from "../../store/actions/notifications.action";
import "./Groups.css";
import Pagination from '../Pagination/Pagination';
import NumberInput from "../../common/components/NumberInput";
import { OnChangeModel } from "../../non_common/types/Form.types";
import Swal from 'sweetalert2';
import { logout } from "../../store/actions/account.actions";
import { IAccount } from "../../store/models/account.interface";
import { SetCurrentPage } from "../../store/actions/groupspagenation.action";

const Users = lazy(() => import("../../components/Users/Users")); 

const Group1s: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const groups: IGroup1State = useSelector((state: IStateType) => state.groups);
  const GroupPagenationState = useSelector((state: IStateType) => state.groupspagenation);
  dispatch(updateCurrentPath("group1", "list"));
  const account: IAccount = useSelector((state: IStateType) => state.account);
  const notifications: INotificationState | null = useSelector((state: IStateType) => state.notifications);

  //これらstateの初期化はページが遷移する度に行われる
  const [findStr, setfindStr] = useState("");
  const [findStrCommit, setfindStrCommit] = useState("");
  const [isDelDataShow, setisDelDataShow] = useState(false);

  function onGroup1Select(Group1: IGroup1): void {
    dispatch(changeSelectedGroup1(Group1));
    dispatch(setModificationState(Group1ModificationStatus.None));
    setIsContentOpen(false);
    setIsHistoryOpen(false);
    setisUsersOpen(false);
  }

  async function onGroup2post(){
    //APIに登録を発行
    const utl =  API_URL+'/api/m_group2_post';
    if (groups.Group2s){
      const data = {
         group_id: groups.selectedGroup?.group_id,
         m_group2_requests:groups.Group2s
       };
      await axios.post(utl, data, {withCredentials: true, headers: {'content-type': 'application/json'} })
      .then(function (response) {
        // 送信成功時の処理

        //登録で更新された情報を反映
        let user_count = 0;
        for (const group2_res of response.data.results) {
          (!group2_res.delflg)?user_count=++user_count:"";//対象有効ユーザ
          for (const group2_state of groups.Group2s) {
            if (group2_res.user_id === group2_state.user_id){
              //登録で更新された箇所を書き戻す
              dispatch(updateGroup2({
                ...group2_state,
                group_id      : group2_res.group_id,
                modify_count1 : group2_res.modify_count1,
                user_id       : group2_res.user_id,
                modify_count2 : group2_res.modify_count2,
                update_u_id   : group2_res.update_u_id,
                update_date   : group2_res.update_date,
                delflg        : group2_res.delflg
              }));
            }
          }     
        }     

        //登録ユーザ数を反映
        if (groups.selectedGroup){
          const foundIndex: number = groups.Group1s.findIndex(pr => pr.group_id === groups.selectedGroup?.group_id);
          let group1: IGroup1 = groups.Group1s[foundIndex];
          group1.user_count = user_count;
          dispatch(editGroup1(group1));
        }




        Swal.fire({
          title: 'success',
          html: response.data.msg,
          icon: 'success',
          confirmButtonText: 'OK'
        })
        return;

      })
      .catch(function (error) {
        // 送信失敗時の処理

        if (error.response.data.return_code==2){
          //トークンが無い状態の場合、ログイン画面に遷移させる
          dispatch(logout());
          return;
        }

        Swal.fire({
          title: 'Error!',
          html: error.message+"<BR>"+error.response.data.msg,
          icon: 'error',
          confirmButtonText: 'OK'
        })

      });
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

  async function Group1Remove() {
    const utl =  API_URL+'/api/m_group1_delete';
    await axios.post(utl, groups.selectedGroup, {withCredentials: true, headers: {'content-type': 'application/json'} })
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
      if(groups.selectedGroup) {
        let msg = groups.selectedGroup.delflg ? 'の削除を取り消しました' : 'を削除しました';

        dispatch(addNotification("グループ", `【${groups.selectedGroup.group_name}】`+msg));
        //10秒後に消す
        setTimeout(function(){if (notifications){dispatch(removeNotification_pre());}},REMOVE_NOTIFICATION_SECONDS);

        if (!groups.selectedGroup.delflg　&& !isDelDataShow){
          dispatch(removeGroup1(groups.selectedGroup.group_id));
        }

        //登録後の各値をリデュースへ反映
        groups.selectedGroup.modify_count1 = response.data.modify_count1;
        groups.selectedGroup.delflg = !groups.selectedGroup.delflg;
        dispatch(editGroup1(groups.selectedGroup));

      }
      dispatch(clearSelectedGroup1());
    })
  }

  function onGroup1Remove() {
    if(groups.selectedGroup) {
      let msg = groups.selectedGroup.delflg ? '削除を取り消しますか？' : '削除しますか？';
      Swal.fire({
        title: msg,
        icon: 'warning',
        showDenyButton: true,
        confirmButtonText: 'はい',
        denyButtonText: 'いいえ',
      }).then((result) => {
        if (result.isConfirmed) {
          // グループ削除処理
          Group1Remove();
        } else if (result.isDenied) {
          Swal.fire('削除を取り消しました', '', 'info')
        }
      })  
    }
  }

  //グループ1を検索(ページネーション)
  async function FindGroup1() {
    const utl = API_URL+'/api/m_group1_find';
    const data = { limit: GroupPagenationState.numberOfDisplaysPerpage,
                  offset: (GroupPagenationState.CurrentPage-1)*GroupPagenationState.numberOfDisplaysPerpage,
                  findstr:findStrCommit,
                  isDelDataShow:isDelDataShow
                 };
    //「application/x-www-form-urlencoded」はURLエンコードした平文での送信
    await axios.post(utl, data, {withCredentials: true, headers: {'content-type': 'application/x-www-form-urlencoded'} })

    .then(function (response) {

      //全グループを初期化
      dispatch(ClearGroup1());
      
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
      let group1_array: Array<IGroup1> = JSON.parse(str);
      
      //map関数は、指定したコールバック関数を配列の要素数分繰り返す(valueは引数であり、配列の各要素が入ってくる)
      //ここでは、配列の要素数だけaddAdminしている
      if (group1_array){
        group1_array.map(value => (dispatch(addGroup1(value))));
      }
    })
    .catch(function (error) {
      // 送信失敗時
      Swal.fire({
        title: 'Error!',
        html: error.message+"<BR>"+error.response.data.msg,
        icon: 'error',
        confirmButtonText: 'OK'
      })
    });
  }

  //グループ2を検索
  async function FindGroup2() {
    const utl = API_URL+'/api/m_group2_find';
    let data = {};
    if (groups.selectedGroup){
      data = { group_id: groups.selectedGroup.group_id};
    }
    await axios.post(utl, data, {withCredentials: true, headers: {'content-type': 'application/x-www-form-urlencoded'} })

    .then(function (response) {

      //グループ2を初期化
      dispatch(ClearGroup2());
      
      //Ractのjson形式に変換(JavaのJsonが届くので)
      const str = JSON.stringify(response.data);
      //jsonを変換
      let group2_array: Array<IGroup2> = JSON.parse(str);
      
      //map関数は、指定したコールバック関数を配列の要素数分繰り返す(valueは引数であり、配列の各要素が入ってくる)
      //ここでは、配列の要素数だけaddAdminしている
      if (group2_array){
        group2_array.map(value => (dispatch(setDataGroup2(value))));
      }
    })
    .catch(function (error) {
      // 送信失敗時
      Swal.fire({
        title: 'Error!',
        html: error.message+"<BR>"+error.response.data.msg,
        icon: 'error',
        confirmButtonText: 'OK'
      })
    });
  }


  async function onGroup1History() {
    if(groups.selectedGroup) {
      await FindGroup1History(groups.selectedGroup.group_id);
      setIsHistoryOpen(true);
      dispatch(setModificationState(Group1ModificationStatus.History));
    }
  }

  async function FindGroup1History(group_id:number) {
    const utl = API_URL+'/api/m_group1_history_find';
    const data = { group_id: group_id};
    //「application/x-www-form-urlencoded」はURLエンコードした平文での送信
    await axios.post(utl, data, {withCredentials: true, headers: {'content-type': 'application/x-www-form-urlencoded'} })

    .then(function (response) {

      //全グループを初期化
     dispatch(ClearGroup1history());
      
      //Ractのjson形式に変換(JavaのJsonが届くので)
      const str = JSON.stringify(response.data);
      //jsonを変換
      let group1_array: Array<IGroup1> = JSON.parse(str);
      
      //map関数は、指定したコールバック関数を配列の要素数分繰り返す(valueは引数であり、配列の各要素が入ってくる)
      //ここでは、配列の要素数だけaddAdminしている
      if (group1_array){
        group1_array.map(value => (dispatch(addGroup1History(value))));
      }
    })
    .catch(function (error) {
      // 送信失敗時
      Swal.fire({
        title: 'Error!',
        html: error.message+"<BR>"+error.response.data.msg,
        icon: 'error',
        confirmButtonText: 'OK'
      })
    });
  }


  //グループ件数検索
  async function m_group1_count() {
    const utl = API_URL+'/api/m_group1_count';
    await axios.post(utl, {findstr: findStrCommit,isDelDataShow:isDelDataShow},{withCredentials: true, headers: {'content-type': 'application/x-www-form-urlencoded'} })

    .then(function (response) {
      //Ractのjson形式に変換(JavaのJsonが届くので)
      const str = JSON.stringify(response.data);
      const data = JSON.parse(str);
      dispatch(setAllCount(data.all_count));
      FindGroup1();
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

//グループフォーム表示用
const [isContentOpen, setIsContentOpen] = useState(false);
//グループ履歴表示用
const [isHistoryOpen, setIsHistoryOpen] = useState(false);
//対象ユーザ一覧表示用
const [isUsersOpen, setisUsersOpen] = useState(false);

let CurrentPage = 0;
useEffect(() => {
  //一覧検索
  m_group1_count();

  FindGroup2();

  CurrentPage = GroupPagenationState.CurrentPage;

  //グループフォームの表示位置までスクロールする
  //https://blog.usize-tech.com/vertical-scroll-by-react/
  if (isContentOpen) {
    if (document.getElementById("group1_form_header")){
      document.getElementById("group1_form_header")!.scrollIntoView({behavior:"smooth",block:"center"});
      setIsContentOpen(false);
    }
  };
  
  //グループ履歴の表示位置までスクロールする
  if (isHistoryOpen) {
    if (document.getElementById("group_history_header")){
      document.getElementById("group_history_header")!.scrollIntoView({behavior:"smooth",block:"center"});
      setIsHistoryOpen(false);
    }
  };

  //グループ編集モードの場合
  //ユーザ一覧の表示位置までスクロールする
  if (isUsersOpen) {
    if (document.getElementById("Users_header")){
      document.getElementById("Users_header")!.scrollIntoView({behavior:"smooth",block:"center"});
      setisUsersOpen(false);
    }
  };


}, [isContentOpen,GroupPagenationState,findStrCommit,isDelDataShow,groups.selectedGroup,isHistoryOpen,isUsersOpen]);


return (
    <Fragment>
      <h1 className="h3 mb-2 text-gray-800">グループマスタ</h1>
        <p className="mb-4">管理画面</p>

        <div className="row">
          <div className="col-xl-12 col-lg-12">
            <div className="card shadow mb-4">
              <div className="card-header py-3">

                <div className="row">
                  <h6 className="mt-3 font-weight-bold text-green col-md-5 ">グループ一覧({groups.all_count}件)</h6>
                  <div className="col-md-4 ">
                      <div className="input-group mt-2">
                        <input type="text" className="form-control" placeholder="キーワード検索" aria-label="キーワード検索" aria-describedby="button-addon2"onChange={(event) => setfindStr(event.target.value)}/>
                        <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={()=> dispatch(setfindStrCommit(findStr))}>検索</button>
                      </div>
                  </div>

                  <div className="col-md-3 ">
                    <div className="header-buttons">
                      <button className="btn btn-success btn-green" onClick={() =>{
                        setIsContentOpen(true);
                        dispatch(setModificationState(Group1ModificationStatus.GroupEdit));
                        setisUsersOpen(true);
                        }}>
                        <i className="fas fa fa-users-cog" title="グループ編集"></i>
                      </button>

                      { (account.authority_lv == AUT_NUM_ADMIN)?// 権限が管理者の場合だけ表示する
                        <button className="btn btn-success btn-green" onClick={() =>{
                          setIsContentOpen(true);
                          dispatch(setModificationState(Group1ModificationStatus.Create));
                          }}>
                          <i className="fas fa fa-plus" title="追加"></i>
                        </button>
                        :""
                      }
                      { (account.authority_lv == AUT_NUM_ADMIN)?// 権限が管理者の場合だけ表示する
                        <button className="btn btn-success btn-blue" onClick={() => {
                            setIsContentOpen(true);
                            dispatch(setModificationState(Group1ModificationStatus.Edit));
                          }}>
                            <i className="fas fa fa-edit" title="変更"></i>
                        </button>
                        :""
                      }
                      { (account.authority_lv == AUT_NUM_ADMIN)?// 権限が管理者の場合だけ表示する
                        <button className="btn btn-success btn-red" onClick={() => onGroup1Remove()}>
                            <i className="fas fa fa-minus" title="削除"></i>
                        </button>
                        :""
                      }
                      <button className="btn btn-success btn-black" onClick={() => onGroup1History()}>
                        <i className="fas fa-history" title="履歴"></i>
                      </button>
                    </div>
                  </div>
                
                </div>

              </div>
              <div className="card-body">
                <GroupList
                    onSelect={onGroup1Select}
                  />
              </div>

              {/* ページネーション */}
              { (account.authority_lv == AUT_NUM_ADMIN)?// 権限が管理者の場合だけ表示する

                <div className="card-footer pt-3">
                  <div className="row">
                    <div className="col-md-2 pt-2">
                      <div className="form-check form-switch">
                      {isDelDataShow ? 
                        <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" checked onClick={() => dispatch(setisDelDataShow(false))}/>
                      :<input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" onClick={() => dispatch(setisDelDataShow(true))} /> 
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
                          value={GroupPagenationState.numberOfDisplaysPerpage}
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
                        numberOfDisplaysPerpage={GroupPagenationState.numberOfDisplaysPerpage} //1ページの表示件数
                        dataCounts={groups.all_count} //総件数数
                        currentPage={CurrentPage} //現在の表示ページ
                      />
                    </div>
                  </div>

                </div>

              :""
              }
            </div>
          </div>

          {((groups.modificationState === Group1ModificationStatus.Create)
            || (groups.modificationState === Group1ModificationStatus.Edit && groups.selectedGroup)) ?
            <GroupForm /> : null
          }

          {(groups.modificationState === Group1ModificationStatus.History)?
            <GroupHistoryList /> : null
          }

          {(groups.modificationState === Group1ModificationStatus.GroupEdit && groups.selectedGroup)?
            <Users 
              onGroup2post={onGroup2post}
              group_name={groups.selectedGroup.group_name}
            /> : null
          }

        </div>

    </Fragment >
  );
};

export default Group1s;
