import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiFillDashboard } from "react-icons/ai";
import { FcNightLandscape } from "react-icons/fc";
import { IStateType } from "../../store/models/root.interface";
import { IAccount } from "../../store/models/account.interface";
import {AUT_NUM_NORMAL,AUT_NUM_ADMIN} from "../../common/constants";

const LeftMenu: React.FC = () => {

    const account: IAccount = useSelector((state: IStateType) => state.account);
    let [leftMenuVisibility, setLeftMenuVisibility] = useState(false);

    function changeLeftMenuVisibility() {
        setLeftMenuVisibility(!leftMenuVisibility);
    }

    function getCollapseClass() {
        return (leftMenuVisibility) ? "" : "collapsed";
    }

    return (
        <Fragment>
            <div className="toggle-area">
                <button className="btn btn-primary toggle-button" onClick={() => changeLeftMenuVisibility()}>
                    <FcNightLandscape size={50}/> 
                </button>
            </div>

            <ul className={`navbar-nav bg-gradient-primary-green sidebar sidebar-dark accordion ${getCollapseClass()}`}
                id="collapseMenu">

                <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                    <div className="sidebar-brand-icon icon-green rotate-n-15">
                    <FcNightLandscape size={50}/> 
                    </div>
                    <div className="sidebar-brand-text mx-3">Kai9 <sup>Opas</sup></div>
                </a>

                <hr className="sidebar-divider my-0" />

                <li className="nav-item">
                    <Link className="nav-link" to="Home">
                    <i>
                        <AiFillDashboard size={30}/> 
                    </i> 
                    <span>ダッシュボード</span>
                    </Link>
                </li>
    
                <hr className="sidebar-divider" />
                <div className="sidebar-heading">
                    Warehouse
                </div>

                <li className="nav-item">
                    <Link className="nav-link" to={`/products`}>
                        <i className="fas fa-fw fa-warehouse"></i>
                        <span>Products</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link" to={`/orders`}>
                        <i className="fas fa-fw fa-dollar-sign"></i>
                        <span>Orders</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link" to={`/srcmake`}>
                        <i className="fas fa-fw fa-marker"></i>
                        <span>ソースコード生成</span>
                    </Link>
                </li>

                <hr className="sidebar-divider" />

                <div className="sidebar-heading">
                    {/* Admin */}

                    {(() => {
                        if (account.authority_lv == AUT_NUM_NORMAL) {
                            return "Normal"
                        }
                        else if (account.authority_lv == AUT_NUM_ADMIN) {
                            return "Admin"
                        } else {
                            return "Read Only"
                        }
                    })()}

                </div>


                <li className="nav-item">
                    <Link className="nav-link" to="/users">
                        <i className="fas fa-fw fa-user"></i>
                        <span>ユーザ</span>
                    </Link>
                </li>

                {(() => {
                    return (
                        <li className="nav-item">
                            <Link className="nav-link" to="/groups">
                                <i className="fas fa-fw fa-users"></i>
                                <span>グループ</span>
                            </Link>
                        </li>
                    )
                })()}

                <li className="nav-item">
                    <Link className="nav-link" to="/App_env">
                        <i className="fas fa-fw fa-gears"></i>
                        <span>環境マスタ</span>
                    </Link>
                </li>


                <hr className="sidebar-divider d-none d-md-block" />
            </ul>
        </Fragment>
    );
};

export default LeftMenu;
