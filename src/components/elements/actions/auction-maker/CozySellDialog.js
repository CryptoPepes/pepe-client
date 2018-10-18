import React from "react";
import PropTypes from "prop-types";
import StartAuctionDialog from "./StartAuctionDialog";
import {cozyAddr} from "../../../../web3Settings";

const CozySellDialog = ({pepeId, open, ...otherProps}) => (
    <StartAuctionDialog auctionAddress={cozyAddr} pepe={pepeId} open={open} auctionType="cozy" dialogTitle="Start cozy-time auction" {...otherProps}>
        Auction cozy-time with pepe #{pepeId} on the market. An auction cannot be reverted.
        In case no one wants cozy time with the pepe, the pepe can be returned to your address by making another transaction.
    </StartAuctionDialog>);


CozySellDialog.propTypes = {
    open: PropTypes.bool,
    pepeId: PropTypes.string.isRequired
};

export default CozySellDialog;
