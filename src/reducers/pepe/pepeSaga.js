import {
    call, put, takeEvery, select
} from 'redux-saga/effects';
import {CALL_DECODE_SUCCESS, CALL_DECODE_FAIL, CALL_FAILED} from "redapp/es/tracking/calls/AT";
import Web3Utils from "web3-utils";
import pepeAT from "./pepeAT";
import PepeAPI from "../../api/api";
import {QueryData} from "../../api/model";

function getNowTimestamp() {
    return Math.round((new Date()).getTime() / 1000);
}

// Do not make the same web3 call again within 20 seconds
const refetchWeb3DataTime = 20;

// Do not make the same API call again within 20 seconds
const refetchApiDataTime = 20;

function* addApiPepe(pepeId, pepe, lcb) {
    // console.log("Adding api pepe: ", pepe, lcb);

    yield put({
        type: pepeAT.ADD_PEPE,
        dataSrc: "api",
        pepeId,
        lcb,
        pepe
    });
}

function* addApiCozyData(pepeId, auction, lcb) {
    // console.log("Adding cozy auction data!", auction, lcb);

    yield put({
        type: pepeAT.ADD_COZY_AUCTION,
        dataSrc: "api",
        pepeId,
        lcb,
        auction: auction || null
    });
}

function* addApiSaleData(pepeId, auction, lcb) {/
    // console.log("Adding sale auction data!", auction, lcb);

    yield put({
        type: pepeAT.ADD_SALE_AUCTION,
        dataSrc: "api",
        pepeId,
        lcb,
        auction: auction || null
    });
}

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
        yield put({type: pepeAT.TRACK_WEB3_CALL, dataType: "pepes", callID, callData: {pepeId, lcb}});
        // Second, tell the store we are getting the pepe, no need to get it again while this is still in-progress.
        yield put({type: pepeAT.GETTING_DATA, dataType: "pepes", pepeId, dataSrc: "web3", timestamp: getNowTimestamp()});
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
        yield put({type: pepeAT.GETTING_DATA, dataType: "pepes", pepeId, dataSrc: "api", timestamp: getNowTimestamp()});

        try {
            // Get the pepe from the API.
            const pepeData = yield PepeAPI.getDataPepe(pepeId);
            yield call(addApiPepe, pepeId, pepeData.pepe, pepeData.lcb);

        } catch (err) {
            console.log("failed to load pepe data from API", err);
            yield put({
                type: pepeAT.GETTING_DATA_FAIL,
                dataSrc: "api",
                dataType: "pepes",
                lcb: 0,
                pepeId,
                err
            });
        }

    }
}

function* getCozyAuction({pepeId}) {

    // Do we have web3 available? If so, use it!
    if (window.pepeWeb3v1) {
        // Fetch it with web3

        const auctionWeb3Data = yield select(state => {
            const auctionData = state.pepe.cozyAuctions[pepeId];
            if (auctionData && auctionData.web3) return auctionData.web3;
            else return null;
        });
        // If we are already getting the pepe, and it's not too long ago, then stop.
        if (auctionWeb3Data && auctionWeb3Data.status === "getting" && (auctionWeb3Data.timestamp < getNowTimestamp() - refetchWeb3DataTime)) return;

        const CozyTimeAuctionContract = yield select(state => state.redapp.contracts.CozyTimeAuction);
        // Get the latest block, this will be the guaranteed block-context of the call, so we know the exact LCB.
        const lcb = yield select(state => state.redapp.tracking.blocks.latest.number);
        // Create the call thunk and get our callID
        const {callID, thunk} = CozyTimeAuctionContract.methods.auctions.cacheCall({blockNr: lcb}, pepeId);
        console.log("making cozy auction web3 call", callID);
        // First, save the context of the call, so we can track progress.
        yield put({type: pepeAT.TRACK_WEB3_CALL, dataType: "cozyAuctions", callID, callData: {pepeId, lcb}});
        // Second, tell the store we are getting the pepe, no need to get it again while this is still in-progress.
        yield put({type: pepeAT.GETTING_DATA, dataType: "cozyAuctions", pepeId, dataSrc: "web3", timestamp: getNowTimestamp()});
        // Third, make the call.
        yield put(thunk);
    } else {
        // Fetch it with the API

        const auctionApiData = yield select(state => {
            const auctionData = state.pepe.cozyAuctions[pepeId];
            if (auctionData && auctionData.api) return auctionData.api;
            else return null;
        });
        // If we are already getting the pepe, and it's not too long ago, then stop.
        if (auctionApiData && auctionApiData.status === "getting" && (auctionApiData.timestamp < getNowTimestamp() - refetchApiDataTime)) return;

        // tell the store we are getting the pepe, no need to get it again while this is still in-progress.
        yield put({type: pepeAT.GETTING_DATA, dataType: "cozyAuctions", pepeId, dataSrc: "api", timestamp: getNowTimestamp()});

        try {
            // Get the pepe from the API.
            const auctionData = yield PepeAPI.getDataCozyAuction(pepeId);
            yield call(addApiCozyData, pepeId, auctionData.auction, auctionData.lcb);

        } catch (err) {
            console.log("failed to load cozy auction data from API", err);
            yield put({
                type: pepeAT.GETTING_DATA_FAIL,
                dataSrc: "api",
                dataType: "cozyAuctions",
                lcb: 0,
                pepeId,
                err
            });
        }

    }
}

function* getSaleAuction({pepeId}) {

    // Do we have web3 available? If so, use it!
    if (window.pepeWeb3v1) {
        // Fetch it with web3

        const auctionWeb3Data = yield select(state => {
            const auctionData = state.pepe.saleAuctions[pepeId];
            if (auctionData && auctionData.web3) return auctionData.web3;
            else return null;
        });
        // If we are already getting the pepe, and it's not too long ago, then stop.
        if (auctionWeb3Data && auctionWeb3Data.status === "getting" && (auctionWeb3Data.timestamp < getNowTimestamp() - refetchWeb3DataTime)) return;

        const PepeAuctionSaleContract = yield select(state => state.redapp.contracts.PepeAuctionSale);
        // Get the latest block, this will be the guaranteed block-context of the call, so we know the exact LCB.
        const lcb = yield select(state => state.redapp.tracking.blocks.latest.number);
        // Create the call thunk and get our callID
        const {callID, thunk} = PepeAuctionSaleContract.methods.auctions.cacheCall({blockNr: lcb}, pepeId);
        console.log("making sale auction web3 call", callID);
        // First, save the context of the call, so we can track progress.
        yield put({type: pepeAT.TRACK_WEB3_CALL, dataType: "saleAuctions", callID, callData: {pepeId, lcb}});
        // Second, tell the store we are getting the pepe, no need to get it again while this is still in-progress.
        yield put({type: pepeAT.GETTING_DATA, dataType: "saleAuctions", pepeId, dataSrc: "web3", timestamp: getNowTimestamp()});
        // Third, make the call.
        yield put(thunk);
    } else {
        // Fetch it with the API

        const auctionApiData = yield select(state => {
            const auctionData = state.pepe.saleAuctions[pepeId];
            if (auctionData && auctionData.api) return auctionData.api;
            else return null;
        });
        // If we are already getting the pepe, and it's not too long ago, then stop.
        if (auctionApiData && auctionApiData.status === "getting" && (auctionApiData.timestamp < getNowTimestamp() - refetchApiDataTime)) return;

        // tell the store we are getting the pepe, no need to get it again while this is still in-progress.
        yield put({type: pepeAT.GETTING_DATA, dataType: "saleAuctions", pepeId, dataSrc: "api", timestamp: getNowTimestamp()});

        try {
            // Get the pepe from the API.
            const auctionData = yield PepeAPI.getDataSaleAuction(pepeId);
            yield call(addApiSaleData, pepeId, auctionData.auction, auctionData.lcb);

        } catch (err) {
            console.log("failed to load sale auction data from API", err);
            yield put({
                type: pepeAT.GETTING_DATA_FAIL,
                dataSrc: "api",
                dataType: "saleAuctions",
                lcb: 0,
                pepeId,
                err
            });
        }

    }
}


/*
TODO:
"bio" (bioData): title, description
"look" (lookData): look
 */

function* checkDataCallSuccess({callID, value}) {
    const pepeWeb3Call = yield select((state) => state.pepe.web3Calls.pepes[callID]);
    // only if it's a pepe, handle like it's a pepe. It could be another type of call being decoded successfully.
    if (!!pepeWeb3Call) {
        // Yeah, we retrieved pepe data successfully from web3. Now we need to forward it to the pepe reducer.
        // Get the number of the block when the call was made, this is our LCB reference
        const lcb = pepeWeb3Call.lcb;
        // Convert decimal values to hex.
        const genotypeSide0 = Web3Utils.toBN(value.genotype[0]).toString(16, 64);
        const genotypeSide1 = Web3Utils.toBN(value.genotype[1]).toString(16, 64);
        // Transform the data to what we expect, remove all web3 extras.
        const pepe = {
            pepeId: pepeWeb3Call.pepeId,
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
            pepe
        });
        return;
    }

    const cozyAuctionWeb3Call = yield select((state) => state.pepe.web3Calls.cozyAuctions[callID]);
    if (!!cozyAuctionWeb3Call) {
        // Get the number of the block when the call was made, this is our LCB reference
        const lcb = cozyAuctionWeb3Call.lcb;
        // Transform the data to what we expect, remove all web3 extras.
        const auction = {
            beginPrice: value.beginPrice,
            endPrice: value.endPrice,
            beginTime: value.auctionBegin,
            endTime: value.auctionEnd,
            seller: value.seller
        };
        yield put({
            type: pepeAT.ADD_COZY_AUCTION,
            dataSrc: "web3",
            lcb,
            auction
        });

        return;
    }

    const saleAuctionWeb3Call = yield select((state) => state.pepe.web3Calls.saleAuctions[callID]);
    if (!!saleAuctionWeb3Call) {
        // Get the number of the block when the call was made, this is our LCB reference
        const lcb = saleAuctionWeb3Call.lcb;
        // Transform the data to what we expect, remove all web3 extras.
        const auction = {
            beginPrice: value.beginPrice,
            endPrice: value.endPrice,
            beginTime: value.auctionBegin,
            endTime: value.auctionEnd,
            seller: value.seller
        };
        yield put({
            type: pepeAT.ADD_SALE_AUCTION,
            dataSrc: "web3",
            lcb,
            auction
        });
    }

    // Add more web3 calls to decode here (do not forget to add return to statement above)
}


function* checkDataCallFailure({callID, err}) {
    const pepeWeb3Call = yield select((state) => state.pepe.web3Calls.pepes[callID]);
    // only if it's a pepe, handle like it's a pepe. It could be another type of call being decoded successfully.
    if (!!pepeWeb3Call) {
        yield put({
            type: pepeAT.GETTING_DATA_FAIL,
            dataSrc: "web3",
            dataType: "pepes",
            lcb: pepeWeb3Call.lcb,
            pepeId,
            err
        });
        return;
    }

    const cozyAuctionWeb3Call = yield select((state) => state.pepe.web3Calls.cozyAuctions[callID]);
    if (!!cozyAuctionWeb3Call) {
        yield put({
            type: pepeAT.GETTING_DATA_FAIL,
            dataSrc: "web3",
            dataType: "cozyAuctions",
            lcb: cozyAuctionWeb3Call.lcb,
            pepeId,
            err
        });
        return;
    }

    const saleAuctionWeb3Call = yield select((state) => state.pepe.web3Calls.saleAuctions[callID]);
    if (!!saleAuctionWeb3Call) {
        yield put({
            type: pepeAT.GETTING_DATA_FAIL,
            dataSrc: "web3",
            dataType: "saleAuctions",
            lcb: saleAuctionWeb3Call.lcb,
            pepeId,
            err
        });
    }

    // Add more web3 calls here (do not forget to add return to statement above)
}

function* queryPepes({queryStr}) {
    console.log("Querying pepes! ", queryStr);

    const prevQueryData = yield select(state => state.pepe.pepeQueries[queryStr]);

    const now = getNowTimestamp();
    // If we are already getting the pepe, and it's not too long ago, then stop.
    if (prevQueryData && prevQueryData.status === "getting" && (prevQueryData.timestamp < now - refetchWeb3DataTime)) return;

    // Tell the store we are making the query (for check above next time)
    yield put({
        type: pepeAT.MAKING_QUERY, queryStr, timestamp: now
    });

    const queryRes = yield PepeAPI.queryPepes(queryStr);
    if (!(queryRes instanceof QueryData)) {
        yield put({
            type: pepeAT.QUERY_FAILURE, err: (queryRes ? queryRes.errStr : "Unknown response type")
        });
    } else {
        const pepeIds = [];
        if (queryRes.pepes) {
            // Now insert all pepes into the store:
            for (let i = 0; i < queryRes.pepes.length; i++) {
                const pepeData = queryRes.pepes[i];
                // Legacy format is used in search output still: pepe attributes are not nested in a "pepe" attribute.
                yield call(addApiPepe, pepeData.pepeId, pepeData, pepeData.lcb);

                // Also add auction data, which is included in the query api results.
                yield call(addApiCozyData, pepeData.pepeId, pepeData.cozy_auction, pepeData.lcb);
                yield call(addApiSaleData, pepeData.pepeId, pepeData.sale_auction, pepeData.lcb);

                pepeIds.push(pepeData.pepeId);
            }
        }
        // Add the query to the store
        yield put({
            type: pepeAT.QUERY_SUCCESS, queryStr, pepeIds, cursor: queryRes.hasMore ? queryRes.cursor : null
        })
    }
}

function* pepeSaga() {
    yield takeEvery(pepeAT.QUERY_PEPES, queryPepes);
    yield takeEvery(pepeAT.GET_PEPE, getPepe);
    yield takeEvery(pepeAT.GET_COZY_AUCTION, getCozyAuction);
    yield takeEvery(pepeAT.GET_SALE_AUCTION, getSaleAuction);
    yield takeEvery(CALL_DECODE_SUCCESS, checkDataCallSuccess);
    yield takeEvery(CALL_DECODE_FAIL, checkDataCallFailure);
    yield takeEvery(CALL_FAILED, checkDataCallFailure);
    // TODO: on Call fail or call decode fail: update pepe status to "error"
}

export default pepeSaga;
