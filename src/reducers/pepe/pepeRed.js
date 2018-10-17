import pepeAT from './pepeAT';

const initialState = {
    // trackingIds of ongoing calls fetching pepe data.
    web3Calls: {
        pepes: {

        }
    },
    pepes: {
    },
    // TODO
    saleAuctions: {
    },
    // TODO
    cozyAuctions: {
    },
    // TODO we do not have to fetch this from an API and can generate it on the client
    lookData: {

    },
    // TODO we do not have to fetch this from an API and can generate it on the client
    bioData: {
        
    }
};

function getNowTimestamp() {
    return Math.round((new Date()).getTime() / 1000);
}

const mapping = {
    [pepeAT.TRACK_WEB3_CALL]: (state, {callType, trackingId, callData}) => ({
        ...state,
        web3Calls: {
            ...state.web3Calls,
            [callType]: {
                ...state.web3Calls[callType],
                [trackingId]: {
                    callData
                }
            }
        }
    }),
    [pepeAT.ADD_PEPE]: (state, {
        dataSrc="api",
        lcb=0,
        pepeId="0",
        name="",
        cool_down_index=0,
        can_cozy_again=0,
        gen=0,
        father="0",
        mother="0",
        genotype="",
        master="0x0"
    }) => ({
        ...state,
        pepes: {
            ...state.pepes,
            [pepeId]: {
                ...state.pepes[pepeId],
                [dataSrc]: {
                    status: "ok",
                    pepe:
                        // Only insert data if LCB (last-change-bloc, i.e. the number of the block of retrieval of the data) is newer than we already have
                        ((state.pepes[pepeId][dataSrc].pepe || {lcb: 0}).lcb > lcb)
                            ? state.pepes[pepeId][dataSrc].pepe
                            : {
                        lcb,
                        pepeId,
                        name,
                        cool_down_index,
                        can_cozy_again,
                        gen,
                        father,
                        mother,
                        genotype,
                        master
                    }
                }
            }
        }
    }),
    [pepeAT.GETTING_PEPE]: (state, {pepeId, dataSrc, timestamp}) => ({
        ...state,
        pepes: {
            ...state.pepes,
            [pepeId]: {
                ...state.pepes[pepeId],
                [dataSrc]: {
                    ...state.pepes[pepeId][dataSrc],
                    status: "getting",
                    timestamp
                }
            }
        }
    })
};

function pepeRed(state = initialState, action) {
    let newState = state;

    if (mapping[action.type]) {
        newState = mapping[action.type](state, action);
    }

    return newState;
}

export default pepeRed;
