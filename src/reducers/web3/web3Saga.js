import {
    call, fork, put, takeLatest, take, cancel, select
} from 'redux-saga/effects';
import web3AT from './web3AT';
import poller from "../util/poller";
import {targetNetID, cpepAddr, cozyAddr, saleAddr, dpepAddr} from "../../web3Settings";
import redappSaga from 'redapp/es/saga';
import { addContract } from 'redapp/es/contracts/actions';
import DPEP_abi from '../../abi/DPEP_abi.json';
import CPEP_abi from '../../abi/CPEP_abi.json';
import sale_abi from '../../abi/sale_abi.json';
import cozy_abi from '../../abi/cozy_abi.json';
import {startAccountPolling} from "redapp/es/tracking/accounts/actions";
import {startBlockPolling} from "redapp/es/tracking/blocks/actions";
import Web3 from "web3";

const getRedappState = rootState => rootState.redapp;

async function getNewWeb3() {
    console.log("Looking to create new web3 instance");
    if (window.ethereum) {
        console.log("Connecting web3 using new protocol (window.ethereum).");
        // Modern dapp browsers...
        window.pepeWeb3v1 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            await window.ethereum.enable();
        } catch (error) {
            console.log("Could not enable Web3 account discovery.")
        }
        return 'CONNECTED';
    } else if (window.web3) {
        console.log("Connecting web3 using legacy protocol (window.web3).");
        // Legacy dapp browsers...
        window.pepeWeb3v1 = new Web3(web3.currentProvider);
        return 'CONNECTED'
    } else {
        console.log("No window.ethereum or window.web3 found, cannot connect to web3.");
        // No web3
        return 'NO_WEB3'
    }
}

function* connectWeb3() {
    console.log("Connecting web3");
    // check current web3 instance
    if (!window.pepeWeb3v1) {
        const web3InitStatus = yield call(getNewWeb3);
        yield put({
            type: web3AT.WEB3_CONNECT_STATUS,
            status: web3InitStatus
        });
    }
}

function* web3ActivePollWorker() {
    const oldStatus = yield select((state) => state.web3.status);
    // Try connect if we can and weren't already
    if (oldStatus !== 'CONNECTED' && (window.ethereum || window.web3)) {
        // Out of sync case; web3js v1 instance sticks, while we are not running redapp. Remove it.
        window.pepeWeb3v1 = undefined;
        yield put({type: web3AT.ASK_WEB3_ON});
    }
    // Fully disconnect if we can't find the web3 anymore
    if (oldStatus === 'CONNECTED' && !(window.ethereum || window.web3)) {
        window.pepeWeb3v1 = undefined;
        yield put({type: web3AT.WEB3_CONNECT_STATUS, status: 'NO_WEB3'});
    }
}

function* web3ActivePollError(err) {
    console.log(err);
}

function* netidPollWorker() {
    const status = yield select((state) => state.web3.status);
    if (status === 'CONNECTED') {
        if (window.pepeWeb3v1) {
            const netID = yield call(window.pepeWeb3v1.eth.net.getId);
            yield put({type: web3AT.WEB3_NETID, networkID: netID});
        } else {
            yield put({
                type: web3AT.WEB3_NETID_ERR
            });
        }
    }
}

function* netidPollError(err) {
    yield put({
        type: web3AT.WEB3_NETID_ERR
    });
}

const getNetID = (state) => state.web3.networkID;

function* runRedappSaga() {
    console.log("Running redapp saga");
    const currentRedappTask = yield fork(redappSaga, window.pepeWeb3v1, targetNetID, getRedappState);
    console.log("Initializing contracts");
    // Load contracts, these will hook into the newly connected web3 instance passed to Redapp
    yield put(addContract("PepeBase", CPEP_abi, { [targetNetID]: { "address": cpepAddr } }));
    yield put(addContract("PepeAuctionSale", sale_abi, { [targetNetID]: { "address": saleAddr } }));
    yield put(addContract("CozyTimeAuction", cozy_abi, { [targetNetID]: { "address": cozyAddr } }));
    yield put(addContract("PepeGrinder", DPEP_abi, { [targetNetID]: { "address": dpepAddr } }));

    console.log("Start background tasks");
    yield put(startAccountPolling(5000));

    // We could enable block-polling (or sub-based) later on, if necessary
    yield put(startBlockPolling(10000));

    // When disconnected, stop Redapp processing
    yield take(action => action.type === web3AT.WEB3_CONNECT_STATUS && action.status !== "CONNECTED");
    console.log("Cancelling redapp task");
    yield cancel(currentRedappTask);
}

function* web3Saga() {
    yield takeLatest(web3AT.ASK_WEB3_ON, connectWeb3);
    yield fork(poller(
        web3AT.WEB3_NETID_START_POLL,
        web3AT.WEB3_NETID_STOP_POLL,
        netidPollWorker,
        netidPollError
    ));
    yield fork(poller(
        web3AT.WEB3_ACTIVE_START_POLL,
        web3AT.WEB3_ACTIVE_STOP_POLL,
        web3ActivePollWorker,
        web3ActivePollError
    ));
    // When connected, start Redapp processing
    yield takeLatest((action => action.type === web3AT.WEB3_CONNECT_STATUS && action.status === "CONNECTED"),
        runRedappSaga);
}

export default web3Saga;
