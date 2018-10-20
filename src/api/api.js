import request from "./request";
import {QueryError, QueryData} from "./model";
import {isValidAccountAddress} from "../util/web3AccountsUtil";

class PepeAPI {

    //Dev:
    //static apiRoot = "http://localhost:3000";
    //Prod main:
    static apiRoot = "https://cryptopepes.io";

    /**
     * Execute a query, asynchronously. Parsed results are returned in a Promise.
     * @param queryStr {string} Query string with search constraints.
     *  Build this with (Query.buildSearchQuery(...)).toURLParamStr().
     * @returns {Promise<QueryData|QueryError>} The parsed results, when they are available.
     */
    static async queryPepes(queryStr) {

        // console.log("Searching for pepes, query: "+queryStr);

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
                ? new QueryData(v) : v);
    }

    static async getDataCozyAuction(pepeId="0") {
        const resp = await request(PepeAPI.apiRoot+"/api/data/cozy/"+pepeId);
        return JSON.parse(resp);
    }

    static async getDataSaleAuction(pepeId="0") {
        const resp = await request(PepeAPI.apiRoot+"/api/data/sale/"+pepeId);
        return JSON.parse(resp);
    }

    static async getDataPepe(pepeId="0") {
        const resp = await request(PepeAPI.apiRoot+"/api/data/pepe/"+pepeId);
        return JSON.parse(resp);
    }

    static async getDataBio(pepeId="0") {
        const resp = await request(PepeAPI.apiRoot+"/api/data/bio/"+pepeId);
        return JSON.parse(resp);
    }

    static async getDataLook(pepeId="0") {
        const resp = await request(PepeAPI.apiRoot+"/api/data/look/"+pepeId);
        return JSON.parse(resp);
    }

    static getPepeSvgSrc(pepeId="0") {
        return PepeAPI.apiRoot+"/api/img/pepe/"+pepeId;
    }

    // legacy
    static async getUserData(address=undefined) {
        if (!address || !isValidAccountAddress(address)) {
            return undefined;
        } else {
            const resp = await request(PepeAPI.apiRoot+"/api/getUser/"+address.toLowerCase());
            return JSON.parse(resp);
        }
    }

}

export default PepeAPI;
