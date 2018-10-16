import Web3Utils from "web3-utils";
import affiliateActionTypes from "../reducers/affiliate/affiliateActionTypes";

export default function setAffiliate(store) {
    if(!store.getState().affiliate.affiliate) {
        let address = window.location.hash.replace("#", "").toLowerCase();

        if(Web3Utils.isAddress(address)) {
            store.dispatch({
                type: affiliateActionTypes.AFFILIATE_SET_AFFILIATE,
                affiliate: address
            })
        }
    }
}