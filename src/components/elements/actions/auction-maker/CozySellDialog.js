import {connect} from "react-redux";
import React from "react";
import PropTypes from "prop-types";
import StartAuctionDialog from "./StartAuctionDialog";

const ConnectedCozySellDialog = connect(state => ({
    auctionAddress: state.hasWeb3 ? state.redapp.contracts.CozyTimeAuction.networks[state.web3.networkId].address : undefined
}))(StartAuctionDialog);

const CozySellDialog = ({pepe, open, ...otherProps}) => (
    <ConnectedCozySellDialog pepe={pepe} open={open} auctionType="cozy" dialogTitle="Start cozy-time auction" {...otherProps}>
        Auction cozy-time with pepe #{pepe.pepeId} on the market. An auction cannot be reverted.
        In case no one wants cozy time with the pepe, the pepe can be returned to your address.
    </ConnectedCozySellDialog>);


CozySellDialog.propTypes = {
    open: PropTypes.bool,
    pepe: PropTypes.shape({
        name: PropTypes.string,
        pepeId: PropTypes.string
    }).isRequired
};

export default CozySellDialog;
