import React from "react";
import { useSelector } from "react-redux";
import { IStateType, IUserState } from "../../store/models/root.interface";
import { IUser } from "../../store/models/user.interface";
import "./Users.css";
import "./UserHistoryList.css";
import moment from 'moment';

export type userListProps = {
  onSelect?: (user: IUser) => void;
  children?: React.ReactNode;
};


function UserHistoryList(props: userListProps): JSX.Element  {
  const users: IUserState = useSelector((state: IStateType) => state.users);

  const userElements: (JSX.Element | null)[] = users.UserHistorys.map(user => {
    if (!user) { return null; }
    return (<tr className={`table-row ${(users.selectedUser && users.selectedUser.user_id === user.user_id) ? "selected" : ""}`}
      onClick={() => {
        if(props.onSelect) props.onSelect(user);
      }}
      key={`user_${user.user_id}`}
      style={user.delflg === true ? { background: "#C0C0C0" } : {}}//削除データを灰色にする
      >
      <th scope="row">{user.modify_count}</th>
      <td>{user.login_id}</td>
      <td>{user.sei}</td>
      <td>{user.mei}</td>
      <td>{user.sei_kana}</td>
      <td>{user.mei_kana}</td>
      <td>{user.need_password_change? "〇":""}</td>
      <td>{user.mail}</td>
      <td>{user.ip}</td>
      <td>{user.default_g_id}</td>
      {user.authority_lv===1 &&<td>一般</td>}
      {user.authority_lv===2 &&<td>参照専用</td>}
      {user.authority_lv===3 &&<td>管理者</td>}
      {!user.authority_lv &&<td>-</td>}
      <td>{user.note}</td>
      <td>{user.update_u_id}</td>
      <td>{moment(user.update_date).format('YYYY/MM/DD HH:mm:ss')}</td>
      <td>{user.delflg? "〇":""}</td>
      <td>{user.password}</td>
    </tr>);
  });

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card shadow mb-4">
          <div className="card-header" id="user_history_header">
            <h6 className="mt-3 font-weight-bold text-green col-md-5 ">変更履歴</h6>
            <i className="fas fa fa-history fa-2x history_position" title="履歴"></i>
            <hr></hr>
            <div className="card-body">
              <div className="table-responsive portlet400">
                <table className="table">
                  <thead className="thead-light ">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">ログインID</th>
                      <th scope="col">姓</th>
                      <th scope="col">名</th>
                      <th scope="col">セイ</th>
                      <th scope="col">メイ</th>
                      <th scope="col">パスワード変更要求</th>
                      <th scope="col">メールアドレス</th>
                      <th scope="col">利用端末IPアドレス</th>
                      <th scope="col">デフォルトグループ</th>
                      <th scope="col">権限レベル</th>
                      <th scope="col">備考</th>
                      <th scope="col">更新者</th>
                      <th scope="col">更新日時</th>
                      <th scope="col">削除フラグ</th>
                      <th scope="col">パスワード</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userElements}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default UserHistoryList;
