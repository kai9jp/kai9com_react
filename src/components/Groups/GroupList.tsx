import React from "react";
import { useSelector } from "react-redux";
import { IStateType, IGroup1State } from "../../store/models/root.interface";
import { IGroup1 } from "../../store/models/group.interface";
// import "../../styles/sb-admin-2.css";

export type groupListProps = {
  onSelect?: (group: IGroup1) => void;
  children?: React.ReactNode;
};


function GroupList(props: groupListProps): JSX.Element  {
  const groups: IGroup1State = useSelector((state: IStateType) => state.groups);

  const groupElements: (JSX.Element | null)[] = groups.Group1s.map(group => {
    if (!group) { return null; }
    return (<tr className={`table-row ${(groups.selectedGroup && groups.selectedGroup.group_id === group.group_id) ? "selected" : ""}`}
      onClick={() => {
        if(props.onSelect) props.onSelect(group);
      }}
      key={`group_${group.group_id}`}
      style={group.delflg === true ? { background: "#C0C0C0" } : {}}//削除データを灰色にする
      >
      <th scope="row">{group.group_id}</th>
      <td>{group.group_name}</td>
      <td>{group.note}</td>
      <td>{group.user_count?.toString()}</td>
    </tr>);
  });

  return (
    <div className="table-responsive portlet">
      <table className="table">
        <thead className="thead-light ">
          <tr>
            <th scope="col">#</th>
            <th scope="col">グループ名</th>
            <th scope="col">備考</th>
            <th scope="col">ユーザ数</th>
          </tr>
        </thead>
        <tbody>
          {groupElements}
        </tbody>
      </table>
    </div>

  );
}

export default GroupList;
