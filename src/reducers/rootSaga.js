import { all, fork } from 'redux-saga/effects';
import web3Saga from 'web3';

export default function* root() {
    yield all([
        fork(web3Saga)
    ]);
}
