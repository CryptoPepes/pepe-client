import PepeAPI from "./api";
import Web3Utils from "web3-utils";

class QueryError {

    constructor(errStr) {
        this.errStr = errStr;
    }
}

class QueryData {

    constructor({
        pepes=[],
        hasMore=true,
        cursor
    }) {
        this.pepes = pepes;
        this.hasMore = hasMore;
        if(cursor) this.cursor = decodeURIComponent(cursor);
    }
}

class AuctionData {
    
    constructor({beginPrice="0", endPrice="0", beginTime=0, endTime=0, seller=undefined}) {
        this.beginPrice = beginPrice;
        this.endPrice = endPrice;
        this.beginTime = beginTime;
        this.endTime = endTime;
        this.seller = seller;
    }

    isDescending() {
        const beginPriceBN = new Web3Utils.BN(this.beginPrice);
        const endPriceBN = new Web3Utils.BN(this.endPrice);

        return beginPriceBN.gt(endPriceBN);
    }

    isExpired() {
        const duration = this.endTime - this.beginTime;
        const durationBN = new Web3Utils.BN(duration);

        if (duration === 0) return undefined;

        const time = Math.floor(Date.now() / 1000);

        const timePassedBN = new Web3Utils.BN(time - this.beginTime);

        return timePassedBN.gt(durationBN);
    }

    /**
     * Get the current price in Wei, formatted as decimal string.
     * @return {undefined|string} Return price. Or undefined if auction has not started / is over.
     */
    getCurrentPrice() {
        return this.getPriceAt(Math.floor(Date.now() / 1000), false);
    }

    /**
     * Get the price in Wei, at the given time, formatted as decimal string.
     * @param time {number} The time to calculate the price for.
     * @param allowOverdue {boolean} If the method should clip the price to end. If not, then it returns undefined.
     * @return {undefined|string} Return price. Or undefined if auction has not started / is over.
     */
    getPriceAt(time, allowOverdue) {
        if (this.beginPrice === undefined || this.endPrice === undefined) return undefined;

        const beginPriceBN = new Web3Utils.BN(this.beginPrice);
        const endPriceBN = new Web3Utils.BN(this.endPrice);

        const priceDifference = endPriceBN.sub(beginPriceBN);
        const timePassedBN = new Web3Utils.BN(time - this.beginTime);
        const duration = this.endTime - this.beginTime;

        let clipToEnd = false;

        // Auction is invalid, ignore it altogether.
        if (duration === 0) return undefined;

        const durationBN = new Web3Utils.BN(duration);

        // Price is undefined if auction is over
        if (timePassedBN.gt(durationBN)) {
            if (allowOverdue) {
                clipToEnd = true;
            } else {
                return undefined;
            }
        }

        let currentPriceBN = null;
        if (clipToEnd) {
            currentPriceBN = endPriceBN;
        } else {
            const priceChangeBN = priceDifference.mul(timePassedBN).div(durationBN);

            currentPriceBN = beginPriceBN.add(priceChangeBN);
        }

        return currentPriceBN.toString(10);
    }
}

class PepeData {

    constructor({
                    pepeId=0,
                    name="",
                    cool_down_index=0,
                    can_cozy_again=0,
                    gen=0,
                    father="0",
                    mother="0",
                    pepe_state="normal",
                    look={
                        skin: {
                            color: "#658749"
                        },
                        head: {
                            eyes: {
                                type: "",
                                color: "#200010"
                            },
                            mouth: "",
                            hair: {
                                type: "",
                                haircolor: "#7d5c27",
                                hatcolor2: "#3e3c3a",
                                hatcolor: "#8c5fc5"
                            }
                        },
                        body: {
                            shirt: {
                                type: "",
                                color: "#0000aa"
                            },
                            neck: ""
                        },
                        extra: {
                            glasses: {
                                type: "",
                                primary: "#112000",
                                secondary: "#202050"
                            }
                        }
                    },
                    sale_auction=undefined,
                    cozy_auction=undefined,
                    bio_title=undefined,
                    bio_description=undefined,
                    genotype="",
                    master="0x0",
                    lcb=0
                }) {
        this.pepeId = pepeId;
        if(name === "") {
            this.name = null;
        } else {
            this.name = name;
        }
        this.cool_down_index = cool_down_index;
        this.can_cozy_again = can_cozy_again;
        this.gen = gen;
        this.father = father;
        this.mother = mother;
        this.pepe_state = pepe_state;
        this.look = look;
        this.sale_auction = sale_auction ? new AuctionData(sale_auction) : undefined;
        this.cozy_auction = cozy_auction ? new AuctionData(cozy_auction) : undefined;
        this.bio_title = bio_title;
        this.bio_description = bio_description;
        this.genotype = genotype;
        this.master = master;
        this.lcb = lcb;
    }
}

class UserData {

    constructor({ username=undefined }) {
        this.username = username;
    }

}

export {QueryError, QueryData, PepeData, AuctionData, UserData};