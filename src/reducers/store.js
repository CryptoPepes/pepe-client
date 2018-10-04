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

// TODO: maybe load TX hashes etc. from storage (?)
const initialState = {
    hasWeb3: true
};


const rootPersistConfig = {
    key: 'root',
    storage,
    // Do not whitelist breeder, that reducer has its own persistor
    whitelist: ["theme", "wallet", "transactions", "transactionTracker"]
};

export default () => {

    // Just try initializing and catch any error.
    try {
        const web3 = initWeb3();
        sagaMiddleware.run(rootSaga, web3);
    } catch (err) {
        alert('Failed to find web3 provider.'
            + ' Please activate your web3 wallet, then reload the page.');
    }


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


    store.dispatch(startAccountPolling(5000));
    store.dispatch(startBlockPolling(10000));

    const persistor = persistStore(store);

    return {store, persistor};

}
