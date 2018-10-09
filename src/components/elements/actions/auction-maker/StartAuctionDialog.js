import React from "react";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {
    Button,
    DialogContentText,
    TextField
} from "@material-ui/core";
import Web3Utils from "web3-utils";
import {connect} from "react-redux";
import DurationInput from "../../util/DurationInput";
import PepeAuctionChart from "../../pepePage/PepeAuctionChart";
import TxDialog from "../TxDialog";

const styles = (theme) => ({
    auctionChart: {
        width: "100%",
        height: "auto",
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2
    }
});

class StartAuctionDialog extends React.Component {

    constructor() {
        super();

        this.state = {
            ...this.state,
            // synced with the Eth inputs, but in Wei.
            startPrice: "",
            endPrice: "",
            // For display purposes only
            startPriceEth: "",
            endPriceEth: "",
            validStartPrice: false,
            validEndPrice: false,
            // undefined as long as tx is not sent
            txTrackingId: undefined,
            auctionDuration: undefined,
            validAuctionDuration: false
        }
    }

    /**
     * Checks if the value of the given input event is a valid price, updates the state.
     * @param priceName The name of the state var that holds the price.
     * @param validName The name of the state var that holds the validity of the input.
     */
    updatePriceInput = (priceName, validName) => (ev) => {

        const input = ev.target.value;
        let validPrice = true;
        let price = undefined;
        try {
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
            [priceName]: price,
            [priceName+"Eth"]: input,
            [validName]: validPrice
        });
    };

    handleDurationChange = (duration, valid) => {

        this.setState({
            auctionDuration: duration,
            validAuctionDuration: valid
        });
    };

    handleTxSend = () => {
        const { PepeBase, auctionAddress, auctionType, hasWeb3, pepe } = this.props;
        const { startPrice, endPrice, validStartPrice, validEndPrice, auctionDuration } = this.state;

        if (hasWeb3 && validStartPrice && validEndPrice && !!auctionAddress) {
            const {txID, thunk} = PepeBase.methods.transferAndAuction.trackedSend(
                {from: pepe.master}, pepe.pepeId,
                auctionAddress, startPrice, endPrice, auctionDuration);

            this.setState({
                txTrackingId: txID,
            });

            this.props.dispatch(thunk);
        }
    };

    render() {
        const {open, onClose, children, hasWeb3, auctionAddress, auctionType, dialogTitle, classes} = this.props;

        const nowTimestamp = Math.floor(Date.now() / 1000);

        return (
            <TxDialog
                open={open}
                onClose={onClose}
                dialogTitle={<span>{dialogTitle || ""}</span>}
                dialogActions={
                    <Button onClick={this.handleTxSend}
                            disabled={!(hasWeb3
                                && this.state.validStartPrice && this.state.validEndPrice
                                && this.state.validAuctionDuration
                                && !!auctionAddress
                            )}
                            variant="raised" color="secondary">
                        Start auction
                    </Button>
                }
                txTrackingId={this.state.txTrackingId}
                loadingWeb3={!hasWeb3}
            >
                <DialogContentText>
                    {children}
                    <br/>
                    Auction address: {auctionAddress}
                </DialogContentText>

                <TextField
                    error={!this.state.validStartPrice}
                    helperText={this.state.validStartPrice ? null : "Invalid price"}
                    label="Start Price (ETH)"
                    value={this.state.startPriceEth}
                    onChange={this.updatePriceInput("startPrice", "validStartPrice")}
                    type="number"
                    margin="dense"
                    fullWidth
                    autoFocus
                />
                <TextField
                    error={!this.state.validEndPrice}
                    helperText={this.state.validEndPrice ? null : "Invalid price"}
                    label="End Price (ETH)"
                    value={this.state.endPriceEth}
                    onChange={this.updatePriceInput("endPrice", "validEndPrice")}
                    type="number"
                    margin="dense"
                    fullWidth
                />
                <DurationInput initialHours={3} onDurationChange={this.handleDurationChange}/>

                <div className={classes.auctionChart}>
                    <PepeAuctionChart auctionData={{
                        beginTime: nowTimestamp,
                        endTime: nowTimestamp + (this.state.validAuctionDuration ? this.state.auctionDuration : (3 * 60 * 60)),
                        beginPrice: this.state.validStartPrice ? this.state.startPrice : "1000000000000000000",
                        endPrice: this.state.validEndPrice ? this.state.endPrice : "1000000000000000000",
                    }} auctionType={auctionType}/>
                </div>

            </TxDialog>
        );
    }

}

StartAuctionDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    pepe: PropTypes.shape({
        name: PropTypes.string,
        pepeId: PropTypes.string
    }).isRequired,
    dialogTitle: PropTypes.string,
    auctionAddress: PropTypes.string.isRequired,
    // "sale" or "cozy"
    auctionType: PropTypes.string.isRequired
};

const styledStartAuctionDialog = withStyles(styles)(StartAuctionDialog);

export default connect(state => ({
    hasWeb3: state.web3.hasWeb3,
    PepeBase: state.redapp.contracts.PepeBase
}))(styledStartAuctionDialog);