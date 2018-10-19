import pepeAT from './pepeAT';

const initialState = {
    // callIDs of ongoing calls fetching pepe data.
    web3Calls: {
        pepes: {

        },
        cozyAuctions: {

        },
        saleAuctions: {

        }
    },
    // Store queries, key = query string. value = {pepeIds: [1, 2, 3, ... pepeIds], err: null | string}
    pepeQueries: {

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

const mapping = {
    [pepeAT.MAKING_QUERY]: (state, {queryStr, timestamp}) => ({
        ...state,
        pepeQueries: {
            ...state.pepeQueries,
            [queryStr]: {
                ...(state.pepeQueries[queryStr] || {}),
                timestamp: timestamp
            }
        }
    }),
    [pepeAT.QUERY_FAILURE]: (state, {queryStr, err}) => ({
        ...state,
        pepeQueries: {
            ...state.pepeQueries,
            [queryStr]: {
                error: err
            }
        }
    }),
    [pepeAT.QUERY_SUCCESS]: (state, {queryStr, pepeIds, cursor=null}) => ({
        ...state,
        pepeQueries: {
            ...state.pepeQueries,
            [queryStr]: {
                pepeIds: pepeIds,
                // cursor is optional, if present, then it implies "hasMore".
                // If not, then this is the last api-page of results.
                cursor: cursor
            }
        }
    }),
    [pepeAT.TRACK_WEB3_CALL]: (state, {dataType, callID, callData}) => ({
        ...state,
        web3Calls: {
            ...state.web3Calls,
            [dataType]: {
                ...state.web3Calls[dataType],
                [callID]: callData
            }
        }
    }),
    [pepeAT.ADD_PEPE]: (state, {
        lcb=0,
        dataSrc = "api",
        pepeId,
        pepe: {
            name = "",
            cool_down_index = 0,
            can_cozy_again = 0,
            gen = 0,
            father = "0",
            mother = "0",
            genotype = "",
            master = "0x0"
        }
    }) => ({
        ...state,
        pepes: {
            ...state.pepes,
            [pepeId]: {
                ...(state.pepes[pepeId] || {}),
                [dataSrc]: {
                    status: "ok",
                    lcb,
                    pepe:
                    // Only insert data if LCB (last-change-bloc, i.e. the number of the block of retrieval of the data) is newer than we already have
                        (state.pepes[pepeId] && state.pepes[pepeId][dataSrc] && ((state.pepes[pepeId][dataSrc].lcb || 0) > lcb))
                            ? state.pepes[pepeId][dataSrc].pepe
                            : {
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
    [pepeAT.ADD_COZY_AUCTION]: (state, {
        lcb=0,
        dataSrc = "api",
        pepeId,
        auction // null in case of no auction, otherwise { beginPrice, endPrice, beginTime, endTime, seller }
    }) => ({
        ...state,
        cozyAuctions: {
            ...state.cozyAuctions,
            [pepeId]: {
                ...(state.cozyAuctions[pepeId] || {}),
                [dataSrc]: {
                    status: "ok",
                    lcb,
                    auction:
                        // Only insert data if LCB (last-change-bloc, i.e. the number of the block of retrieval of the data) is newer than we already have
                        (state.cozyAuctions[pepeId] && state.cozyAuctions[pepeId][dataSrc] && ((state.cozyAuctions[pepeId][dataSrc].lcb || 0) > lcb))
                            ? state.cozyAuctions[pepeId][dataSrc].auction
                            : auction
                }
            }
        }
    }),
    [pepeAT.ADD_SALE_AUCTION]: (state, {
        lcb=0,
        dataSrc = "api",
        pepeId,
        auction // null in case of no auction, otherwise { beginPrice, endPrice, beginTime, endTime, seller }
    }) => ({
        ...state,
        saleAuctions: {
            ...state.saleAuctions,
            [pepeId]: {
                ...(state.saleAuctions[pepeId] || {}),
                [dataSrc]: {
                    status: "ok",
                    lcb,
                    auction:
                    // Only insert data if LCB (last-change-bloc, i.e. the number of the block of retrieval of the data) is newer than we already have
                        (state.saleAuctions[pepeId] && state.saleAuctions[pepeId][dataSrc] && ((state.saleAuctions[pepeId][dataSrc].lcb || 0) > lcb))
                            ? state.saleAuctions[pepeId][dataSrc].auction
                            : auction
                }
            }
        }
    }),
    [pepeAT.GETTING_DATA]: (state, {dataType, pepeId, dataSrc, timestamp}) => ({
        ...state,
        [dataType]: {
            ...state[dataType],
            [pepeId]: {
                ...state[dataType][pepeId],
                [dataSrc]: {
                    ...(state[dataType][pepeId] && state[dataType][pepeId][dataSrc]),
                    status: "getting",
                    lcb: 0,
                    timestamp
                }
            }
        }
    }),
    [pepeAT.GETTING_DATA_FAIL]: (state, {dataType, pepeId, dataSrc, lcb, err}) => ({
        ...state,
        [dataType]: {
            ...state[dataType],
            [pepeId]: {
                ...state[dataType][pepeId],
                [dataSrc]: {
                    ...(state[dataType][pepeId] && state[dataType][pepeId][dataSrc]),
                    status: "error",
                    lcb,
                    err
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
