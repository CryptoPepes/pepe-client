import React from "react";
import PropTypes from "prop-types";
import Web3Utils from "web3-utils";

class BidAuctionDialog extends React.Component {

    constructor() {
        super();

        this.state = {
            // synced with the Eth inputs, but in Wei.
            bidPrice: "",
            // For display purposes only
            bidPriceEth: "",
            validBidPrice: false,
            // undefined as long as tx is not sent
            txTrackingId: undefined,
        }
    }

    /**
     * Checks if the value of the given input event is a valid price, updates the state.
     */
    updateBidPriceInput = (ev) => {

        const input = ev.target.value;
        let validPrice = true;
        let price = undefined;
        try {
            // TODO check against current price
            if (!!input || input === "0") {
                price = Web3Utils.toBN(Web3Utils.toWei(input, "ether"));
                if (price.isNeg()) {
                    validPrice = false;
                }
            } else {
                validPrice = false;
            }
        } catch (e) {
            validPrice = false;
        }

        this.setState({
            bidPrice: price,
            bidPriceEth: input,
            validBidPrice: validPrice
        });
    };

}

BidAuctionDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
};

export default BidAuctionDialog;