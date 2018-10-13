import request from "./request";
import {QueryError, QueryData, PepeData, UserData} from "./model";
import {isValidAccountAddress} from "../util/web3AccountsUtil";
//TODO API backoffs + retry.
//import backoff from "backoff";

class PepeAPI {

    //Dev:
    //static apiRoot = "http://localhost:3000";
    //Prod main:
    static apiRoot = "https://cryptopepes.io";
    //Prod dev:
    // static apiRoot = "https://dev.cryptopepes.io";

    /**
     * Execute a query, asynchronously. Parsed results are returned in a Promise.
     * @param query {Query} Query object with search constraints. Build this with Query.buildSearchQuery.
     * @returns {Promise<QueryData|QueryError>} The parsed results, when they are available.
     */
    static async queryPepes(query) {

        const queryStr = query.toURLParamStr();

        console.log("Searching for pepes, query: "+queryStr);


        let resp = await request(PepeAPI.apiRoot + "/api/search" + queryStr);

        try {
            return PepeAPI.parseQueryJSON(resp)
        } catch (err) {
            return new QueryError(resp);
        }
    }

    static parseQueryJSON(queryDataJson) {
        //reviver checks for response key being a valid object with a pepes array.
        //Other objects are passed to the pepe
        return JSON.parse(queryDataJson,
            (k, v) => (v instanceof Object && v.pepes)
                ? new QueryData(v) : ((v instanceof Object && v.look) ? new PepeData(v) : v));
    }

    static async getPepeData(pepeId="0") {
        const resp = await request(PepeAPI.apiRoot+"/api/getPepe/"+pepeId);
        console.log("retrieved pepe data: ", resp);
        return PepeAPI.parsePepeJSON(resp)
    }

    static parsePepeJSON(pepeDataJson) {
        //reviver checks for response key being a valid object with a "look"
        return JSON.parse(pepeDataJson,
            (k, v) => (v instanceof Object && v.look) ? new PepeData(v) : v);
    }

    static getPepeSvgSrc(pepeId="0") {
        return PepeAPI.apiRoot+"/api/getPepeSVG/"+pepeId;
    }

    static async getUserData(address=undefined) {
        if (!address || !isValidAccountAddress(address)) {
            return undefined;
        } else {
            const resp = await request(PepeAPI.apiRoot+"/api/getUser/"+address.toLowerCase());
            return PepeAPI.parseUserJSON(resp);
        }
    }

    static parseUserJSON(userDataJson) {
        return JSON.parse(userDataJson,
            (k, v) => (v instanceof Object && v.username) ? new UserData(v) : v);
    }
}

export default PepeAPI;
