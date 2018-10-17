import { all, fork } from 'redux-saga/effects';
import web3Saga from './web3/web3Saga';
import pepeSaga from './pepe/pepeSaga';

export default function* root() {
    yield all([
        fork(web3Saga),
        fork(pepeSaga)
    ]);
}
