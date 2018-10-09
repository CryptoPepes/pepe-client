import {
    call, fork, put, takeLatest, take, cancel
} from 'redux-saga/effects';
import web3AT from './web3AT';
import poller from "../util/poller";
import {targetNetID, cpepAddr, cozyAddr, saleAddr} from "../../web3Settings";
import redappSaga from 'redapp/es/saga';
import { addContract } from 'redapp/es/contracts/actions';
import CPEP_abi from '../../abi/CPEP_abi.json';
import sale_abi from '../../abi/sale_abi.json';
import cozy_abi from '../../abi/cozy_abi.json';
import {startAccountPolling} from "redapp/es/tracking/accounts/actions";
import {startBlockPolling} from "redapp/es/tracking/blocks/actions";
import Web3 from "web3";

const getRedappState = rootState => rootState.redapp;

async function getNewWeb3() {
    console.log("Creating new web3 instance");
    if (window.ethereum) {
        // Modern dapp browsers...
        window.web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            await window.ethereum.enable();
        } catch (error) {
            console.log("Could not enable Web3 account discovery.")
        }
        return 'CONNECTED';
    } else if (window.web3) {
        // Legacy dapp browsers...
        window.pepeWeb3v1 = new Web3(web3.currentProvider);
        return 'CONNECTED'
    } else {
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

function* netidPollWorker() {
    const netID = yield call(window.pepeWeb3v1.eth.net.getId);
    yield put({type: web3AT.WEB3_NETID, networkID: netID});
}

function* netidPollError(err) {
    yield put({
        type: web3AT.WEB3_CONNECT_STATUS,
        status: 'DISCONNECTED'
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

    console.log("Start background tasks");
    yield put(startAccountPolling(5000));
    yield put(startBlockPolling(10000));

    // When disconnected, stop Redapp processing
    yield take(action => action.type === web3AT.WEB3_CONNECT_STATUS && action.status === "DISCONNECTED");
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
    // When connected, start Redapp processing
    yield takeLatest((action => action.type === web3AT.WEB3_CONNECT_STATUS && action.status === "CONNECTED"),
        runRedappSaga);
    yield takeLatest((action => action.type === web3AT.WEB3_CONNECT_STATUS && action.status === "DISCONNECTED"),
        connectWeb3);
}

export default web3Saga;
