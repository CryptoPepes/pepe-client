import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducer from './reducer';
import rootSaga from './rootSaga';
import createSagaMiddleware from 'redux-saga';

import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import web3AT from "./web3/web3AT"; // defaults to localStorage for web


// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();

const initialState = {

};


const rootPersistConfig = {
    key: 'root',
    storage,
    // Do not whitelist breeder, that reducer has its own persistor
    whitelist: ["theme", "wallet", "affiliate", "pepe"]
};

export default () => {

    console.log("Re-initializing local store.");

    const persistedReducer = persistReducer(rootPersistConfig, reducer);

    // Only create store once (Hot module replacement etc.)
    if (window.store == null) {
        const store = createStore(
            persistedReducer,
            initialState,
            composeEnhancers(
                applyMiddleware(
                    thunkMiddleware,
                    sagaMiddleware
                )
            )
        );

        sagaMiddleware.run(rootSaga);

        window.store = store;

    } else if (process.env.NODE_ENV === "development") {
        // But replace the root reducer in development
        window.store.replaceReducer(persistedReducer);
    }

    // Trigger connection
    window.store.dispatch({type: web3AT.ASK_WEB3_ON});
    // Check network ID every 5 seconds
    window.store.dispatch({
        type: web3AT.WEB3_NETID_START_POLL, interval: 5000
    });
    // Check web3 availability every 5 seconds
    window.store.dispatch({
        type: web3AT.WEB3_ACTIVE_START_POLL, interval: 5000
    });

    const persistor = persistStore(window.store);

    return {store: window.store, persistor};

}
