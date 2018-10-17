import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

import {
    Button,
    DialogContentText,
    Grid, TextField, Typography
} from "@material-ui/core";

import BidAuctionDialog from "./BidAuctionDialog";
import PepeAuctionChart from "../../pepePage/PepeAuctionChart";

import Web3Utils from "web3-utils";
import {getDefaultAccount} from "../../../../util/web3AccountsUtil";
import PepeGridItem from "../../grid/PepeGridItem";
import {withStyles} from "@material-ui/core/styles/index";
import TxDialog from "../TxDialog";
import ReporterContent from "../../reporting/ReporterContent";
import {cozyAddr} from "../../../../web3Settings";


const styles = (theme) => ({
    pepeGridContainer: {
        paddingTop: 20,
        paddingBottom: 20,
        marginLeft: "auto",
        marginRight: "auto"
    },
    auctionChart: {
        width: "100%",
        height: "auto",
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2
    },
    errorListItem: {
        margin: theme.spacing.unit
    }
});

class CozyBuyDialogInner extends BidAuctionDialog {


    handleTxSend = () => {
        const { PepeBase, auctionAddress, motherPepe, fatherPepe, cozyCandidateAsFather, wallet, hasWeb3, affiliate } = this.props;
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


        const auctionSubject = cozyCandidateAsFather ? motherPepe : fatherPepe;
        // the other pepe
        const candidate = cozyCandidateAsFather ? fatherPepe : motherPepe;

        if (hasWeb3 && validBidPrice && !!auctionAddress) {
            let call;
            //if affiliate is set
            if (affiliate && Web3Utils.isAddress(affiliate)) {
                call = PepeBase.methods.approveAndBuyAffiliated.trackedSend(
                    {from: buyerAccount, value: bidPrice},
                    auctionSubject.pepeId,
                    auctionAddress,
                    candidate.pepeId,
                    cozyCandidateAsFather,
                    affiliate
                );
            } else {
                call = PepeBase.methods.approveAndBuy.trackedSend(
                    {from: buyerAccount, value: bidPrice},
                    auctionSubject.pepeId,
                    auctionAddress,
                    candidate.pepeId,
                    cozyCandidateAsFather
                );
            }

            this.setState({
                txTrackingId: call.txID,
            });

            this.props.dispatch(call.thunk);
        }
    };

    render() {
        const {open, onClose, classes, hasWeb3, auctionAddress, motherPepe, fatherPepe, cozyCandidateAsFather} = this.props;

        const auctionSubject = cozyCandidateAsFather ? motherPepe : fatherPepe;
        // the other pepe
        const candidate = cozyCandidateAsFather ? fatherPepe : motherPepe;

        const auctionData = auctionSubject.cozy_auction;

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

        const cozyAuctionExpired = auctionData.isExpired();

        const isDescending = auctionData.isDescending();

        // Suggest price for 5 minutes later, to account for possible minting delay
        // If the price is descending, recommend the current price.
        const suggestedPrice = isDescending ? auctionData.getCurrentPrice() : auctionData.getPriceAt(nowTimestamp + (5 * 60), true);

        const errorMsgs = [];

        if (auctionSubject.can_cozy_again > nowTimestamp) {
            errorMsgs.push(<ReporterContent variant="error" message={
                `Error! Corrupt data! Auctioned pepe (${auctionSubject.pepeId}) seems to have an active cozy-time cooldown!`
            }/>);
        }

        if (candidate.can_cozy_again > nowTimestamp) {
            errorMsgs.push(<ReporterContent variant="error" message={
                `Error! The candiate pepe (${candidate.pepeId}) seems to have an active cozy-time cooldown! It can't hop yet!`
            }/>);
        }

        if (cozyAuctionExpired) {
            errorMsgs.push(<ReporterContent variant="error" message={
                `Error! The auction is expired!`
            }/>);
        }

        return (
            <TxDialog
                open={open}
                onClose={onClose}
                dialogTitle={<span>Bid on cozy-time auction</span>}
                dialogActions={
                    <Button onClick={this.handleTxSend}
                            disabled={!(hasWeb3
                                && this.state.validBidPrice
                                && !!auctionAddress
                            ) || errorMsgs.length > 0}
                            variant="raised" color="secondary">
                        Make a bid!
                    </Button>
                }
                extra={errorMsgs.length > 0
                    ? <div>
                        {errorMsgs.map((el, i) => (
                            <div className={classes.errorListItem}
                                 key={"error-msg-" + i}>{el}</div>
                        ))}
                      </div>
                    : null}
                txTrackingId={this.state.txTrackingId}
                loadingWeb3={!hasWeb3}
            >
                <DialogContentText>
                    Bid for cozy-time with pepe #{auctionSubject.pepeId}, with pepe #{candidate.pepeId} as hop' candidate.
                    Pepe #{auctionSubject.pepeId} will be the {cozyCandidateAsFather ? "mother" : "father"}.
                    And pepe #{candidate.pepeId} will be the {cozyCandidateAsFather ? "father" : "mother"}.
                    An auction cannot be reverted. In case they hop',
                    the resulting pepe is transferred to the address used to bid.
                    <br/>
                    Auction address: {auctionAddress}
                    <br/>
                    Important: do not forget to account for price changes while
                    the transaction is unconfirmed. It may be a good idea to add some margin.
                </DialogContentText>

                <br/>

                <div className={classes.pepeGridContainer}>
                    <Grid container justify="center" spacing={40}>
                        <Grid xs={12} sm={6} item>
                            <PepeGridItem pepe={motherPepe}/>
                        </Grid>
                        <Grid xs={12} sm={6} item>
                            <PepeGridItem pepe={fatherPepe}/>
                        </Grid>
                    </Grid>
                </div>

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
                    <PepeAuctionChart auctionData={auctionData} auctionType="cozy"/>
                </div>
            </TxDialog>
        );
    }
}

const styledCozyBuyDialog = withStyles(styles)(CozyBuyDialogInner);

const CozyBuyDialog = connect(state => ({
    hasWeb3: state.web3.hasWeb3,
    wallet: state.redapp.tracking.accounts.wallet,
    auctionAddress: cozyAddr,
    PepeBase: state.redapp.contracts.PepeBase,
    affiliate: state.affiliate.affiliate
}))(styledCozyBuyDialog);


CozyBuyDialog.propTypes = {
    open: PropTypes.bool,
    motherPepe: PropTypes.shape({
        name: PropTypes.string,
        pepeId: PropTypes.string
    }).isRequired,
    fatherPepe: PropTypes.shape({
        name: PropTypes.string,
        pepeId: PropTypes.string
    }).isRequired,
    cozyCandidateAsFather: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
};

export default CozyBuyDialog;
