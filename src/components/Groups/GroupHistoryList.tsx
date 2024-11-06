import React from "react";
import { useSelector } from "react-redux";
import { IStateType, IGroup1State } from "../../store/models/root.interface";
import { IGroup1 } from "../../store/models/group.interface";
import "./Groups.css";
import "./GroupHistoryList.css";
import moment from 'moment';

export type groupListProps = {
  onSelect?: (group: IGroup1) => void;
  children?: React.ReactNode;
};


function GroupHistoryList(props: groupListProps): JSX.Element  {
  const groups: IGroup1State = useSelector((state: IStateType) => state.groups);

  const groupElements: (JSX.Element | null)[] = groups.Group1Historys.map(group => {
    if (!group) { return null; }
    return (<tr className={`table-row ${(groups.selectedGroup && groups.selectedGroup.group_id === group.group_id) ? "selected" : ""}`}
      onClick={() => {
        if(props.onSelect) props.onSelect(group);
      }}
      key={`group_${group.group_id}`}
      style={group.delflg === true ? { background: "#C0C0C0" } : {}}//削除データを灰色にする
      >
      <th scope="row">{group.modify_count1}</th>
      <td>{group.group_name}</td>
      <td>{group.note}</td>
      <td>{group.update_u_id}</td>
      <td>{moment(group.update_date).format('YYYY/MM/DD HH:mm:ss')}</td>
      {/* <td>{formatDateTime(group.update_date)}</td> */}
      <td>{group.delflg? "〇":""}</td>
    </tr>);
  });

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card shadow mb-4">
          <div className="card-header" id="group_history_header">
            <h6 className="mt-3 font-weight-bold text-green col-md-5 ">変更履歴</h6>
            <i className="fas fa fa-history fa-2x history_position" title="履歴"></i>
            <hr></hr>
            <div className="card-body">
              <div className="table-responsive portlet400">
                <table className="table">
                  <thead className="thead-light ">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">グループ名</th>
                      <th scope="col">備考</th>
                      <th scope="col">更新者</th>
                      <th scope="col">更新日時</th>
                      <th scope="col">削除フラグ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupElements}
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

export default GroupHistoryList;
