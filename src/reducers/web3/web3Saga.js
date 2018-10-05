import {
    call, fork, put, takeLatest
} from 'redux-saga/effects';
import web3AT from './web3AT';
import poller from "../util/poller";

// TODO
// - detect web3 ON
// - detect web3 disconnected -> set OFF
// - detect web3 connected
// - handle ON action; enable
// - poll network ID

async function reconnectWeb3() {
    if (window.ethereum) {
        // Modern dapp browsers...
        // keep old window.web3
        try {
            // Request account access if needed
            await ethereum.enable();
            return 'SUCCESS';
        } catch (error) {
            return 'DENIED'
        }
    } else if (window.web3) {
        // Legacy dapp browsers...
        window.web3.setProvider(web3.currentProvider);
        return 'SUCCESS'
    } else {
        // No web3
        return 'NO_WEB3'
    }
}

async function getNewWeb3() {
    if (window.ethereum) {
        // Modern dapp browsers...
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            return 'SUCCESS';
        } catch (error) {
            return 'DENIED'
        }
    } else if (window.web3) {
        // Legacy dapp browsers...
        window.web3 = new Web3(web3.currentProvider);
        return 'SUCCESS'
    } else {
        // No web3
        return 'NO_WEB3'
    }
}

function* connectWeb3() {
    // check current web3 instance
    if (window.web3) {
        // already have an web3, re-connect it if necessary
        if (!window.web3.isConnected()) {
            const web3ReconnectStatus = yield call(reconnectWeb3);
            yield put({
                type: web3AT.WEB3_CONNECT_STATUS,
                status: web3ReconnectStatus
            });
        }
    } else {
        const web3InitStatus = yield call(getNewWeb3);
        yield put({
            type: web3AT.WEB3_CONNECT_STATUS,
            status: web3InitStatus
        });
    }
}

function* netidPollWorker(web3) {
    const netID = yield call(web3.eth.net.getId);
    yield put({type: web3AT.WEB3_NETID, networkID: netID});
}

function* netidPollError(err) {
    yield put({
        type: web3AT.WEB3_CONNECT_STATUS,
        status: 'DISCONNECTED'
    });
}

function* web3Saga() {
    yield takeLatest(web3AT.ASK_WEB3_ON, connectWeb3);
    yield fork(poller(
        web3AT.WEB3_NETID_START_POLL,
        web3AT.WEB3_NETID_STOP_POLL,
        netidPollWorker,
        netidPollError,
        web3, getAccountsState
    ));
}
