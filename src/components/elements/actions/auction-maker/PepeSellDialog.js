import {connect} from "react-redux";
import React from "react";
import PropTypes from "prop-types";
import StartAuctionDialog from "./StartAuctionDialog";

const ConnectedPepeSellDialog = connect(state => ({
    auctionAddress: state.hasWeb3 ? state.redapp.contracts.PepeAuctionSale.networks[state.web3.networkId].address : undefined
}))(StartAuctionDialog);

const PepeSellDialog = ({pepe, open, ...otherProps}) => (
    <ConnectedPepeSellDialog pepe={pepe} open={open} auctionType="sale" dialogTitle="Start Pepe auction" {...otherProps}>
        Sell pepe #{pepe.pepeId} on the market. An auction cannot be reverted.
        In case no one buys the pepe, the pepe can be returned to your address.
    </ConnectedPepeSellDialog>);


PepeSellDialog.propTypes = {
    open: PropTypes.bool,
    pepe: PropTypes.shape({
        name: PropTypes.string,
        pepeId: PropTypes.string
    }).isRequired
};

export default PepeSellDialog;
