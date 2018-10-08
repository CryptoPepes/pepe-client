import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducer from './reducer';
import rootSaga from './rootSaga';
import createSagaMiddleware from 'redux-saga';

import initWeb3 from 'redapp/es/initWeb3';
import { startAccountPolling } from 'redapp/es/tracking/accounts/actions';
import { startBlockPolling } from 'redapp/es/tracking/blocks/actions';

import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web


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

    //sagaMiddleware.run(rootSaga);

    const persistor = persistStore(store);

    return {store, persistor};

}
