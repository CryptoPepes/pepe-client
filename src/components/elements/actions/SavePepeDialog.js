import React from "react";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {
    Button,
    DialogContentText
} from "@material-ui/core";
import { connect } from 'react-redux';
import TxDialog from "./TxDialog";
import {cozyAddr, saleAddr} from "../../../web3Settings";

const styles = (theme) => ({

});

class SavePepeDialog extends React.Component {

    constructor() {
        super();

        this.state = {
            // undefined as long as tx is not sent
            txTrackingId: undefined
        }
    }


    handleTxSend = () => {
        const { auctionContract, hasWeb3, pepeId, auctionData } = this.props;

        const auction = !auctionData ? null : auctionData.auction;

        if (hasWeb3 && auction) {

            // Use the original pepe-owner address, the seller, to retrieve it back.
            // The pepe.master is set to the auction contract currently.
            const pepeOwner = auction.seller;

            const {txID, thunk} = auctionContract.methods.savePepe.trackedSend({from: pepeOwner}, pepeId);

            this.setState({
                txTrackingId: txID,
            });

            this.props.dispatch(thunk);
        }
    };


    render() {
        const {open, onClose, pepeId, hasWeb3, auctionData, auctionAddress, auctionType} = this.props;

        const isLoadingAuction = auctionData.status !== "ok";

        return (
            <TxDialog
                open={open}
                onClose={onClose}
                dialogTitle={<span>Retrieve Pepe #{pepeId} from {auctionType === "cozy" ? "cozy" : "sale"} contract.</span>}
                dialogActions={
                    <Button onClick={this.handleTxSend}
                            disabled={!hasWeb3 || isLoadingAuction}
                            variant="raised" color="secondary">
                        Retrieve pepe
                    </Button>
                }
                txTrackingId={this.state.txTrackingId}
                loadingWeb3={!hasWeb3}
            >
                {/* Preview Pepe with image etc. */}
                <DialogContentText>
                    Retrieve Pepe #{pepeId} back from auction contract.
                    <br/>
                    Auction address: {auctionAddress}
                </DialogContentText>
            </TxDialog>
        );
    }

}

SavePepeDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    pepeId: PropTypes.string,
    auctionType: PropTypes.string
};

const styledSavePepeDialog = withStyles(styles)(SavePepeDialog);

export default connect((state, props) => {
    const auctionContract = props.auctionType === "sale"
        ? state.redapp.contracts.PepeAuctionSale
        : state.redapp.contracts.CozyTimeAuction;
    // Get the right auction data
    const auctionData = props.auctionType === "sale" ? state.pepe.saleAuctions[props.pepeId] : state.pepe.cozyAuctions[props.pepeId];
    const auctionAddr = props.auctionType === "sale"
        ? saleAddr
        : cozyAddr;
    return ({
        hasWeb3: state.web3.hasWeb3,
        auctionContract: auctionContract,
        auctionData: (auctionData && (auctionData.web3 || auctionData.api)) || {},
        auctionAddress: auctionAddr
    });
})(styledSavePepeDialog);
