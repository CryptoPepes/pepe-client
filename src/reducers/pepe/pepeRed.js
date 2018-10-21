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

const cleanupState = (dataType, state, minTime) => {
    const collection = state[dataType];
    return Object.keys(collection)
            .filter(key => (!collection[key].web3 || collection[key].web3.timestamp > minTime) && (!collection[key].api || collection[key].api.timestamp > minTime))
            .reduce((obj, key) => {
                obj[key] = collection[key];
                return obj;
            }, {});
};

const mapping = {
    [pepeAT.CLEANUP_PEPES]: (state, {minTime}) => ({
        ...state,
        // Remove all the old calls
        web3Calls: {},
        // Remove all old queries
        pepeQueries: Object.keys(state.pepeQueries)
            .filter(key => state.pepeQueries[key].timestamp > minTime)
            .reduce((obj, key) => {
                obj[key] = state.pepeQueries[key];
                return obj;
            }, {}),
        // Remove all old data
        pepes: cleanupState("pepes", state, minTime),
        cozyAuctions: cleanupState("cozyAuctions", state, minTime),
        saleAuctions: cleanupState("saleAuctions", state, minTime),
        looks: cleanupState("looks", state, minTime),
        bios: cleanupState("bios", state, minTime)
    }),
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
    [pepeAT.QUERY_FAILURE]: (state, {queryStr, timestamp, err}) => ({
        ...state,
        pepeQueries: {
            ...state.pepeQueries,
            [queryStr]: {
                error: err,
                timestamp
            }
        }
    }),
    [pepeAT.QUERY_SUCCESS]: (state, {queryStr, pepeIds, timestamp, cursor=null}) => ({
        ...state,
        pepeQueries: {
            ...state.pepeQueries,
            [queryStr]: {
                pepeIds: pepeIds,
                // cursor is optional, if present, then it implies "hasMore".
                // If not, then this is the last api-page of results.
                cursor: cursor,
                timestamp
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
        timestamp,
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
                    timestamp,
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
                // Only change status to getting if it's not already loaded. If it's loaded,
                // then we can still continue getting, but don't remove the previous data, as it's a good placeholder.
                // And there is a rare case where the getting action is delayed, and the data is already there before it knows it.
                [dataSrc]: (state[dataType][pepeId] && state[dataType][pepeId][dataSrc]
                    && state[dataType][pepeId][dataSrc].status === "ok")
                    ? state[dataType][pepeId][dataSrc] : {
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
