import { createStore, applyMiddleware, Store  } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducers from "./reducers/root.reducer";


const store: Store = createStore(rootReducers, applyMiddleware(
    //[宮村]rootReducersについて
    //reduxでグローバル変数を作成している

    //[宮村]applyMiddlewareについて
    //ReduxのStore管理は同期処理なので、redux-thunkを使う事で非同期処理に拡張する
    //https://qiita.com/jima-r20/items/7fee2f00dbd1f302e373
    thunkMiddleware
));

store.subscribe(() => {});
export default store;