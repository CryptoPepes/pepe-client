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
    whitelist: ["theme", "wallet", "transactions", "transactionTracker"]
};

export default () => {

    const persistedReducer = persistReducer(rootPersistConfig, reducer);

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

    store.dispatch({type: web3AT.ASK_WEB3_ON});

    const persistor = persistStore(store);

    return {store, persistor};

}
