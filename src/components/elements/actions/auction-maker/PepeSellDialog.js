import React from "react";
import PropTypes from "prop-types";
import StartAuctionDialog from "./StartAuctionDialog";
import {saleAddr} from "../../../../web3Settings";

const PepeSellDialog = ({pepeId, open, ...otherProps}) => (
    <StartAuctionDialog auctionAddress={saleAddr} pepeId={pepeId} open={open} auctionType="sale" dialogTitle="Start Pepe auction" {...otherProps}>
        Sell pepe #{pepeId} on the market. An auction cannot be reverted.
        In case no one buys the pepe, the pepe can be returned to your address by making another transaction.
    </StartAuctionDialog>);

PepeSellDialog.propTypes = {
    open: PropTypes.bool,
    pepeId: PropTypes.string.isRequired
};

export default PepeSellDialog;
