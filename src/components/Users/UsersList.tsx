import React,{useState,useEffect} from "react";
import { useSelector } from "react-redux";
import { IStateType, IUserState,IGroup1State } from "../../store/models/root.interface";
import { IUser } from "../../store/models/user.interface";
import { Group1ModificationStatus } from "../../store/models/group.interface";

export type userListProps = {
  onSelect?: (user: IUser) => void;
  onUserChecked?: (user: IUser,checked: boolean) => void;
  children?: React.ReactNode;
};

function UserList(props: userListProps): JSX.Element  {
  const users: IUserState = useSelector((state: IStateType) => state.users);
  const groups: IGroup1State = useSelector((state: IStateType) => state.groups);
  const [is_group_edit_mode, setis_group_edit_mode] = useState(false);

  //ユーザIDをキーにGroup2データの存在確認を行う
  function IsGropup2(user_id: Number){
    const foundIndex: number = groups.Group2s.findIndex(pr => pr.user_id === user_id);
    return (foundIndex === -1)? false:!groups.Group2s[foundIndex].delflg;
  }

  useEffect(() => {
    //グループ編集モードの判定(/usersの場合はNO判定)
    setis_group_edit_mode(groups.modificationState === Group1ModificationStatus.GroupEdit && !window.location.href.match("/users"));
  }, [groups.modificationState]);

  const userElements: (JSX.Element | null)[] = users.Users.map(user => {
    if (!user) { return null; }
    return (<tr className={`table-row ${(users.selectedUser && users.selectedUser.user_id === user.user_id) ? "selected" : ""}`}
      onClick={() => {
        if(props.onSelect) props.onSelect(user);
      }}
      key={`user_${user.user_id}`}
      style={user.delflg === true ? { background: "#C0C0C0" } : {}}//削除データを灰色にする
      >
      <th scope="row">{user.user_id}</th>
      {(is_group_edit_mode)?//グループ変更モードの場合だけ表示
      <td><input className="form-check-input ml-2" type="checkbox" value="" id="flexCheckChecked" checked={IsGropup2(user.user_id)}
        onChange={(e) => {
          if(props.onUserChecked) props.onUserChecked(user,e.target.checked);
        }}
      /></td>
      :null
      }
      <td>{user.login_id}</td>
      <td>{user.sei}</td>
      <td>{user.mei}</td>
      <td>{user.mail}</td>
      {user.authority_lv===1 &&<td>一般</td>}
      {user.authority_lv===2 &&<td>参照専用</td>}
      {user.authority_lv===3 &&<td>管理者</td>}
      {!user.authority_lv &&<td>-</td>}
    </tr>);
  });

  return (
    <div className="table-responsive portlet">
      <table className="table">
        <thead className="thead-light ">
          <tr>
            <th scope="col">#</th>
            {(is_group_edit_mode)?//グループ変更モードの場合だけ表示
            <th scope="col">選択</th>
            :null
            }
            <th scope="col">ログインID</th>
            <th scope="col">姓</th>
            <th scope="col">名</th>
            <th scope="col">メアド</th>
            <th scope="col">権限</th>
          </tr>
        </thead>
        <tbody>
          {userElements}
        </tbody>
      </table>
    </div>

  );
}

export default UserList;
