import React from "react";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {
    Button,
    DialogContentText,
    TextField
} from "@material-ui/core";
import { connect } from 'react-redux';
import TxDialog from "./TxDialog";

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
        const { auctionContract, hasWeb3, pepe, auctionType } = this.props;

        if (hasWeb3) {

            // Use the original pepe-owner address, the seller, to retrieve it back.
            // The pepe.master is set to the auction contract currently.
            const pepeOwner = auctionType === "cozy"
                ? pepe.cozy_auction.seller
                : pepe.sale_auction.seller;

            const {txID, thunk} = auctionContract.methods.savePepe.trackedSend({from: pepeOwner}, pepe.pepeId);

            this.setState({
                txTrackingId: txID,
            });

            this.props.dispatch(thunk);
        }
    };


    render() {
        const {open, onClose, pepe, hasWeb3, auctionAddress, auctionType} = this.props;

        return (
            <TxDialog
                open={open}
                onClose={onClose}
                dialogTitle={<span>Retrieve Pepe #{pepe.pepeId} from {auctionType === "cozy" ? "cozy" : "sale"} contract.</span>}
                dialogActions={
                    <Button onClick={this.handleTxSend}
                            disabled={!hasWeb3}
                            variant="raised" color="secondary">
                        Retrieve pepe
                    </Button>
                }
                txTrackingId={this.state.txTrackingId}
                loadingWeb3={!hasWeb3}
            >
                {/* Preview Pepe with image etc. */}
                <DialogContentText>
                    Retrieve Pepe #{pepe.pepeId} back from auction contract.
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
    pepe: PropTypes.shape({
        name: PropTypes.string,
        pepeId: PropTypes.string
    }).isRequired,
    auctionType: PropTypes.string
};

const styledSavePepeDialog = withStyles(styles)(SavePepeDialog);

export default connect((state, props) => {
    const auctionContract = props.auctionType === "sale"
        ? state.redapp.contracts.PepeAuctionSale
        : state.redapp.contracts.CozyTimeAuction;
    return ({
            hasWeb3: state.web3.hasWeb3,
            auctionContract: auctionContract,
            auctionAddress: state.web3.hasWeb3 ? auctionContract.networks[state.web3.networkId].address : undefined,

    })
})(styledSavePepeDialog);
