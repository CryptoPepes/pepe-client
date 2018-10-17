import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

import {
    Button,
    DialogContentText,
    TextField, Typography
} from "@material-ui/core";

import BidAuctionDialog from "./BidAuctionDialog";
import PepeAuctionChart from "../../pepePage/PepeAuctionChart";

import Web3Utils from "web3-utils";
import {getDefaultAccount} from "../../../../util/web3AccountsUtil";
import PepeGridItem from "../../grid/PepeGridItem";
import {withStyles} from "@material-ui/core/styles/index";
import TxDialog from "../TxDialog";
import {saleAddr} from "../../../../web3Settings";


const styles = (theme) => ({
    auctionChart: {
        width: "100%",
        height: "auto",
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2
    }
});

class PepeBuyDialogInner extends BidAuctionDialog {

    handleTxSend = () => {
        const { auctionContract, auctionAddress, wallet, hasWeb3, pepe, affiliate } = this.props;
        const { bidPrice, validBidPrice } = this.state;

        if (!hasWeb3) {
            // this.setState({
            //     warningMsg: "Web3 is not loaded.",
            // });
            return;
        }

        const buyerAccount = getDefaultAccount(wallet);
        if (!buyerAccount) {
            console.log("Could not find default account!");
            // this.setState({
            //     warningMsg: "Could not find default Web3 account",
            // });
            return;
        }

        if (hasWeb3 && validBidPrice && !!auctionAddress) {

            let call;

            if (affiliate && Web3Utils.isAddress(affiliate)) {
                call = auctionContract.methods.buyPepeAffiliated.trackedSend(
                    {from: buyerAccount, value: bidPrice}, pepe.pepeId, affiliate
                );
            } else {
                call = auctionContract.methods.buyPepe.trackedSend(
                    {from: buyerAccount, value: bidPrice}, pepe.pepeId
                );
            }

            this.setState({
                txTrackingId: call.txID,
            });

            this.props.dispatch(call.thunk);
        }
    };

    render() {
        const {open, onClose, pepe, hasWeb3, auctionAddress, classes} = this.props;

        const auctionData = pepe.sale_auction;

        if (!auctionData) {
            return (
                <TxDialog
                    open={open}
                    onClose={onClose}
                    dialogTitle={<span>Bid on Pepe auction</span>}
                    txTrackingId={this.state.txTrackingId}
                    loadingWeb3={!hasWeb3}
                >
                    <DialogContentText>
                        No auction data found.
                    </DialogContentText>
                </TxDialog>
            );
        }

        const nowTimestamp = Math.floor(Date.now() / 1000);

        const isDescending = auctionData.isDescending();

        // Suggest price for 5 minutes later, to account for possible minting delay
        // If the price is descending, recommend the current price.
        const suggestedPrice = isDescending ? auctionData.getCurrentPrice() : auctionData.getPriceAt(nowTimestamp + (5 * 60), true);

        return (
            <TxDialog
                open={open}
                onClose={onClose}
                dialogTitle={<span>Bid on Pepe auction</span>}
                dialogActions={
                    <Button onClick={this.handleTxSend}
                            disabled={!(hasWeb3
                                && this.state.validBidPrice
                                && !!auctionAddress
                            )}
                            variant="raised" color="secondary">
                        Make a bid!
                    </Button>
                }
                txTrackingId={this.state.txTrackingId}
                loadingWeb3={!hasWeb3}
            >
                <DialogContentText>
                    Bid pepe #{pepe.pepeId}. An auction bid cannot be reverted
                     (you could try to invalidate the TX with a higher gas fee, but this is not advisable).
                    In case the pepe is bought, the pepe is transferred to the address used to bid on the pepe.
                    <br/>
                    Auction address: {auctionAddress}
                    <br/>
                    Important: do not forget to account for price changes while
                    the transaction is unconfirmed. It may be a good idea to add some margin.
                </DialogContentText>

                <br/>

                <PepeGridItem pepe={pepe}/>

                <br/>

                <Typography>
                    Suggested price: Ξ {Web3Utils.fromWei(suggestedPrice, "ether")}
                </Typography>
                <Typography>
                    ({isDescending
                    ? "auction price is descending, recommended current price"
                    : "accounting for 5 min TX minting delay"}
                    ).
                </Typography>

                <TextField
                    error={!this.state.validBidPrice}
                    helperText={this.state.validBidPrice ? null : "Invalid price"}
                    label="Bid Price (ETH)"
                    value={this.state.startPriceEth}
                    onChange={this.updateBidPriceInput}
                    type="number"
                    margin="dense"
                    fullWidth
                    autoFocus
                />

                <div className={classes.auctionChart}>
                    <PepeAuctionChart auctionData={auctionData} auctionType="sale"/>
                </div>

            </TxDialog>
        );
    }
}

const styledSaleBuyDialog = withStyles(styles)(PepeBuyDialogInner);

const PepeBuyDialog = connect(state => ({
    hasWeb3: state.web3.hasWeb3,
    wallet: state.redapp.tracking.accounts.wallet,
    auctionAddress: saleAddr,
    auctionContract: state.redapp.contracts.PepeAuctionSale,
    affiliate: state.affiliate.affiliate,
}))(styledSaleBuyDialog);


PepeBuyDialog.propTypes = {
    open: PropTypes.bool,
    pepeId: PropTypes.string.isRequired,
    onClose: PropTypes.func,
};

export default PepeBuyDialog;
