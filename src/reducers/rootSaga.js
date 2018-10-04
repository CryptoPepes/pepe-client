import { all, fork } from 'redux-saga/effects';
import redappSaga from 'redapp/es/saga';

import { networkId } from '../web3Settings';

const getRedappState = rootState => rootState.redapp;

export default function* root(web3) {
    yield all([
        fork(redappSaga, web3, networkId, getRedappState) // Set default network ID to ropsten (ID = 3)
    ]);
}
