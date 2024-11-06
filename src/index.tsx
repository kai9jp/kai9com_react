import React from "react";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./styles/sb-admin-2.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
//自作は「my.css」へ
import "./styles/my.css";
import {Provider} from "react-redux";
import store from "./store/store";
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
if ( container ) {
    const root = createRoot(container);
    root.render(<Provider store={store}><App /></Provider>);
}

//APPをProviderで囲いreduxを用いている(このstoreに、大量のインターフェーズが実装されている)
//ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

// f you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
