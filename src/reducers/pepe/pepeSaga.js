import {
    put, takeEvery, select
} from 'redux-saga/effects';
import {CALL_DECODE_SUCCESS, CALL_DECODE_FAIL} from "redapp/es/tracking/calls/actions";
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

        const {pepeStatus, timestamp} = yield select(state => {
            const pepeData = state.pepe.pepes[pepeId];
            if (pepeData && pepeData.web3) return pepeData.web3;
            else return null;
        });
        // If we are already getting the pepe, and it's not too long ago, then stop.
        if (pepeStatus === "getting" && (timestamp < getNowTimestamp() - refetchWeb3DataTime)) return;

        const PepeBaseContract = yield select(state => state.redapp.contracts.PepeBase);
        // Get the latest block, this will be the guaranteed block-context of the call, so we know the exact LCB.
        const lcb = yield select(state => state.redapp.tracking.blocks.latest.number);
        // Create the call thunk and get our trackingId
        const {trackingId, thunk} = PepeBaseContract.methods.getPepe.cacheCall({blockNr: lcb}, pepeId);
        // First, save the context of the call, so we can track progress.
        yield put({type: pepeAT.TRACK_WEB3_CALL, callType: "pepes", trackingId, callData: {pepeId, lcb}});
        // Second, tell the store we are getting the pepe, no need to get it again while this is still in-progress.
        yield put({type: pepeAT.GETTING_PEPE, pepeId, dataSrc: "web3", timestamp: getNowTimestamp()});
        // Third, make the call.
        yield put(thunk);
    } else {
        // Fetch it with the API

        const {pepeStatus, timestamp} = yield select(state => {
            const pepeData = state.pepe.pepes[pepeId];
            if (pepeData && pepeData.api) return pepeData.api;
            else return null;
        });
        // If we are already getting the pepe, and it's not too long ago, then stop.
        if (pepeStatus === "getting" && (timestamp < getNowTimestamp() - refetchApiDataTime)) return;

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
                master: value.master
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

function* checkDataResult({trackingId, value}) {
    const web3Call = yield select((state) => state.pepe.web3Calls.pepes[trackingId]);
    // only if it's a pepe, handle like it's a pepe. It could be another type of call being decoded successfully.
    if (!!web3Call) {
        // Yeah, we retrieved pepe data successfully from web3. Now we need to forward it to the pepe reducer.
        // Get the number of the block when the call was made, this is our LCB reference
        const lcb = web3Call.blockNumber;
        // Transform the data to what we expect, remove all web3 extras.
        const pepe = {
            pepeId: web3Call.pepeId,
            name: value.pepeName,
            cool_down_index: value.coolDownIndex,
            can_cozy_again: value.canCozyAgain,
            gen: value.generation,
            father: value.father,
            mother: value.mother,
            genotype: value.genotype[1].replace("0x", "") + value.genotype[0].replace("0x", ""),
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
    takeEvery(pepeAT.GET_PEPE, getPepe);
    takeEvery(CALL_DECODE_SUCCESS, checkDataResult);
}

export default pepeSaga;
