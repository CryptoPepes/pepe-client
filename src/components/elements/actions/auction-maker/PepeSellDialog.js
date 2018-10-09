import React from "react";
import PropTypes from "prop-types";
import StartAuctionDialog from "./StartAuctionDialog";
import {saleAddr} from "../../../../web3Settings";

const PepeSellDialog = ({pepe, open, ...otherProps}) => (
    <StartAuctionDialog auctionAddress={saleAddr} pepe={pepe} open={open} auctionType="sale" dialogTitle="Start Pepe auction" {...otherProps}>
        Sell pepe #{pepe.pepeId} on the market. An auction cannot be reverted.
        In case no one buys the pepe, the pepe can be returned to your address.
    </StartAuctionDialog>);

PepeSellDialog.propTypes = {
    open: PropTypes.bool,
    pepe: PropTypes.shape({
        name: PropTypes.string,
        pepeId: PropTypes.string
    }).isRequired
};

export default PepeSellDialog;
