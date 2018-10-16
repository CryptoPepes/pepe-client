import {
    call, fork, put, takeEvery, take, cancel, select
} from 'redux-saga/effects';
import {CALL_DECODE_SUCCESS, CALL_DECODE_FAIL} from "redapp/es/tracking/calls/actions";
import pepeAT from "../web3/pepeAT";

function getPepe() {

}

function* checkDataResult({trackingId, value}) {
    const web3Call = yield select((state) => state.pepe.web3Calls[trackingId]);
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
            ...pepe
        });
    }
}

function* pepeSaga() {
    takeEvery(pepeAT.GET_PEPE, getPepe);
    takeEvery(CALL_DECODE_SUCCESS, checkDataResult);
}

export default pepeSaga;
