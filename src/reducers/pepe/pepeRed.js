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
    looks: {

    },
    // TODO we do not have to fetch this from an API and can generate it on the client
    bios: {
        
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
    [pepeAT.ADD_DATA]: (state, {
        lcb=0,
        dataSrc = "api",
        dataType,
        dataName,
        pepeId,
        data
    }) => ({
        ...state,
        [dataType]: {
            ...state[dataType],
            [pepeId]: {
                ...(state[dataType][pepeId] || {}),
                [dataSrc]: {
                    status: "ok",
                    lcb,
                    [dataName]:
                    // Only insert data if LCB (last-change-bloc, i.e. the number of the block of retrieval of the data) is newer than we already have
                        (state[dataType][pepeId] && state[dataType][pepeId][dataSrc] && ((state[dataType][pepeId][dataSrc].lcb || 0) > lcb))
                            ? state[dataType][pepeId][dataSrc][dataName]
                            : data
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
