import React,{lazy} from "react";
import "./App.css";
import { BrowserRouter, Routes,Route } from "react-router-dom";
import Login from "./components/Account/Login";
import { PrivateRoute } from "./common/components/PrivateRoute";
import { AccountRoute } from "./common/components/AccountRoute";

const Home = lazy(() => import("./components/Home/Home")); 
const Users = lazy(() => import("./components/Users/Users")); 
const Groups = lazy(() => import("./components/Groups/Groups")); 
const Products = lazy(() => import("./components/Products/Products")); 
const Orders = lazy(() => import("./components/Orders/Orders")); 
const SrcMake = lazy(() => import("./components/SrcMake/SrcMakeForm")); 
const App_env = lazy(() => import("./components/App_env/App_env"));


//[宮村]React.FCについて
//React.FCとは、constによる型定義でコンポーネントを定義できる型
//https://interrupt.co.jp/blog/entry/2021/03/05/133925

//[宮村]RouterとRouterについて 
//pathと同じ場合は、そのコンポーネントを表示する

//https://zenn.dev/khale/articles/react-router-update-v6
const App: React.FC = () => {
  return (
    <div className="App" id="wrapper">
        <BrowserRouter>
          <Routes>
            {/* <Route path="/" element={<PrivateRoute><Admin /></PrivateRoute>} /> */}
            <Route element={<PrivateRoute/>}>
              <Route path="/*" element={<Home/>} />
              <Route path="/home" element={<Home/>} />
              <Route path="/users" element={<Users/>} />
              <Route path="/groups" element={<Groups/>} />
              <Route path="/products" element={<Products/>} />
              <Route path="/orders" element={<Orders/>} />
              <Route path="/srcmake" element={<SrcMake/>} />
              <Route path="/App_env" element={<App_env/>} />
              </Route> 

            <Route element={<AccountRoute/>}>
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home/>} />
              </Route> 
          </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
