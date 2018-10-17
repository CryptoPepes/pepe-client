import {
    put, takeEvery, select
} from 'redux-saga/effects';
import {CALL_DECODE_SUCCESS, CALL_DECODE_FAIL} from "redapp/es/tracking/calls/AT";
import Web3Utils from "web3-utils";
import pepeAT from "./pepeAT";
import PepeAPI from "../../api/api";

function getNowTimestamp() {
    return Math.round((new Date()).getTime() / 1000);
}

// Do not make the same web3 call again within 20 seconds
const refetchWeb3DataTime = 20;

// Do not make the same API call again within 20 seconds
const refetchApiDataTime = 20;

function* getPepe({pepeId}) {

    // Do we have web3 available? If so, use it!
    if (window.pepeWeb3v1) {
        // Fetch it with web3

        const pepeWeb3Data = yield select(state => {
            const pepeData = state.pepe.pepes[pepeId];
            if (pepeData && pepeData.web3) return pepeData.web3;
            else return null;
        });
        // If we are already getting the pepe, and it's not too long ago, then stop.
        if (pepeWeb3Data && pepeWeb3Data.status === "getting" && (pepeWeb3Data.timestamp < getNowTimestamp() - refetchWeb3DataTime)) return;

        const PepeBaseContract = yield select(state => state.redapp.contracts.PepeBase);
        // Get the latest block, this will be the guaranteed block-context of the call, so we know the exact LCB.
        const lcb = yield select(state => state.redapp.tracking.blocks.latest.number);
        // Create the call thunk and get our callID
        const {callID, thunk} = PepeBaseContract.methods.getPepe.cacheCall({blockNr: lcb}, pepeId);
        console.log("making pepe web3 call", callID);
        // First, save the context of the call, so we can track progress.
        yield put({type: pepeAT.TRACK_WEB3_CALL, callType: "pepes", callID, callData: {pepeId, lcb}});
        // Second, tell the store we are getting the pepe, no need to get it again while this is still in-progress.
        yield put({type: pepeAT.GETTING_PEPE, pepeId, dataSrc: "web3", timestamp: getNowTimestamp()});
        // Third, make the call.
        yield put(thunk);
    } else {
        // Fetch it with the API

        const pepeApiData = yield select(state => {
            const pepeData = state.pepe.pepes[pepeId];
            if (pepeData && pepeData.api) return pepeData.api;
            else return null;
        });
        // If we are already getting the pepe, and it's not too long ago, then stop.
        if (pepeApiData && pepeApiData.status === "getting" && (pepeApiData.timestamp < getNowTimestamp() - refetchApiDataTime)) return;

        // tell the store we are getting the pepe, no need to get it again while this is still in-progress.
        yield put({type: pepeAT.GETTING_PEPE, pepeId, dataSrc: "api", timestamp: getNowTimestamp()});

        try {
            // Get the pepe from the API.
            const pepeData = yield PepeAPI.getPepeData(pepeId);

            const pepe = {
                pepeId,
                name: pepeData.name,
                cool_down_index: pepeData.cool_down_index,
                can_cozy_again: pepeData.can_cozy_again,
                gen: pepeData.gen,
                father: pepeData.father,
                mother: pepeData.mother,
                genotype: pepeData.genotype,
                master: pepeData.master
            };

            yield put({
                type: pepeAT.ADD_PEPE,
                dataSrc: "api",
                lcb: pepeData.lcb,
                ...pepe
            });
        } catch (err) {
            console.log("failed to load pepe data from API", err);
        }

    }
}

function* checkDataResult({callID, value}) {
    const web3Call = yield select((state) => state.pepe.web3Calls.pepes[callID]);
    // only if it's a pepe, handle like it's a pepe. It could be another type of call being decoded successfully.
    if (!!web3Call) {
        // Yeah, we retrieved pepe data successfully from web3. Now we need to forward it to the pepe reducer.
        // Get the number of the block when the call was made, this is our LCB reference
        const lcb = web3Call.lcb;
        // Convert decimal values to hex.
        const genotypeSide0 = Web3Utils.toBN(value.genotype[0]).toString(16, 64);
        const genotypeSide1 = Web3Utils.toBN(value.genotype[1]).toString(16, 64);
        // Transform the data to what we expect, remove all web3 extras.
        const pepe = {
            pepeId: web3Call.pepeId,
            name: value.pepeName,
            cool_down_index: value.coolDownIndex,
            can_cozy_again: value.canCozyAgain,
            gen: value.generation,
            father: value.father,
            mother: value.mother,
            genotype: genotypeSide1 + genotypeSide0,
            master: value.master
        };
        yield put({
            type: pepeAT.ADD_PEPE,
            dataSrc: "web3",
            lcb,
            ...pepe
        });
    }
}

function* pepeSaga() {
    yield takeEvery(pepeAT.GET_PEPE, getPepe);
    yield takeEvery(CALL_DECODE_SUCCESS, checkDataResult);
}

export default pepeSaga;
