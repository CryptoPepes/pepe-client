const pepeAT = {
    // When a tracking call was made and we have to remember the context of the tracking ID
    TRACK_WEB3_CALL: "TRACK_WEB3_CALL",
    // When data is being fetched
    GETTING_DATA: "GETTING_DATA",
    // When data could not be feteched and/or decoded
    GETTING_DATA_FAIL: "GETTING_DATA_FAIL",
    // Action to get a look of a pepe
    GET_LOOK: "GET_LOOK",
    // Action to get the bio of a pepe
    GET_BIO: "GET_BIO",
    // Action to get a pepe
    GET_PEPE: "GET_PEPE",
    // Action to get the cozy auction data of a pepe
    GET_COZY_AUCTION: "GET_COZY_AUCTION",
    // Action to get the sale auction data of a pepe
    GET_SALE_AUCTION: "GET_SALE_AUCTION",
    // When a pepe look is to be added to the redux state
    ADD_LOOK: "ADD_LOOK",
    // When a pepe bio is to be added to the redux state
    ADD_BIO: "ADD_BIO",
    // When data is to be added to the redux state
    ADD_DATA: "ADD_DATA",
    // Query pepes
    QUERY_PEPES: "QUERY_PEPES",
    // When a query is in progress
    MAKING_QUERY: "MAKING_QUERY",
    // When query is complete
    QUERY_SUCCESS: "QUERY_SUCCESS",
    // When query failed
    QUERY_FAILURE: "QUERY_FAILURE",
    // Clear everything that was updated last before the given block-number
    CLEANUP_PEPES: "CLEANUP_PEPES",
    START_INTERVAL_CLEANUP: "START_INTERVAL_CLEANUP",
    STOP_INTERVAL_CLEANUP: "STOP_INTERVAL_CLEANUP"
};

export default pepeAT;
