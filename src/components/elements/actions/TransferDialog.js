import React from "react";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {
    Button,
    DialogContentText,
    TextField
} from "@material-ui/core";
import { connect } from 'react-redux';
import Web3Utils from "web3-utils";
import TxDialog from "./TxDialog";
import ReporterContent from "../reporting/ReporterContent";

const styles = (theme) => ({

});

class TransferDialog extends React.Component {

    constructor() {
        super();

        this.state = {
            transferInput: "",
            validTransferAddress: false,
            // undefined as long as tx is not sent
            txTrackingId: undefined
        }
    }

    /**
     * Checks if the value of the given input event is a valid address, updates the state.
     * @param ev The input event
     */
    updateTransferInput = (ev) => {

        const address = ev.target.value;
        const validAddress = Web3Utils.isAddress(address);
        this.setState({
            transferAddress: address,
            validTransferAddress: validAddress
        });
    };

    handleTransferSend = () => {
        const { PepeBase, hasWeb3, pepeData, pepeId } = this.props;

        const pepe = !pepeData ? null : pepeData.pepe;

        if (hasWeb3 && pepe) {
            const {txID, thunk} = PepeBase.methods.transfer.trackedSend(
                { from: pepe.master }, this.state.transferAddress, pepeId);

            this.setState({
                txTrackingId: txID,
            });

            this.props.dispatch(thunk);
        }
    };


    render() {
        const {open, onClose, pepeData, pepeId, hasWeb3} = this.props;

        const isLoadingPepe = pepeData.status !== "ok";

        return (

            <TxDialog
                open={open}
                onClose={onClose}
                dialogTitle={<span>Transfer Pepe #{pepeId}</span>}
                dialogActions={
                    <Button onClick={this.handleTransferSend}
                    disabled={!this.state.validTransferAddress || (isLoadingPepe)}
                    variant="raised" color="secondary">
                    Transfer
                    </Button>
                }
                txTrackingId={this.state.txTrackingId}
                loadingWeb3={!hasWeb3}
            >

                {/* TODO Preview Pepe with image etc. */}
                <DialogContentText>
                    Transfer pepe #{pepeId} to another wallet. This cannot be reverted!
                </DialogContentText>

                {pepeData.status === "error"
                    ? <ReporterContent variant="error" message="Failed to load pepe data."/>
                    : (isLoadingPepe && <ReporterContent variant="info" message="Loading pepe data..."/>)}

                <TextField
                    autoFocus
                    margin="dense"
                    label="Receiver Address"
                    type="text"
                    error={!this.state.validTransferAddress}
                    onChange={e => this.updateTransferInput(e)}
                    fullWidth
                />

                {/* TODO preview address with blockie picture */}
            </TxDialog>
        );
    }

}

TransferDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    pepeId: PropTypes.string
};

const styledTransferDialog = withStyles(styles)(TransferDialog);

export default connect((state, props) => ({
    hasWeb3: state.web3.hasWeb3,
    PepeBase: state.redapp.contracts.PepeBase,
    pepeData: (state.pepe.pepes[props.pepeId] && (state.pepe.pepes[props.pepeId].web3 || state.pepe.pepes[props.pepeId].api)) || {}
}))(styledTransferDialog);

