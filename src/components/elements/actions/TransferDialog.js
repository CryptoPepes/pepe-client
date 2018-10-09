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
        const { PepeBase, hasWeb3, pepe } = this.props;

        if (hasWeb3) {
            const {txID, thunk} = PepeBase.methods.transfer.trackedSend(
                { from: pepe.master }, this.state.transferAddress, pepe.pepeId);

            this.setState({
                txTrackingId: txID,
            });

            this.props.dispatch(thunk);
        }
    };


    render() {
        const {open, onClose, pepe, hasWeb3} = this.props;

        return (

            <TxDialog
                open={open}
                onClose={onClose}
                dialogTitle={<span>Transfer Pepe #{pepe.pepeId}</span>}
                dialogActions={
                    <Button onClick={this.handleTransferSend}
                    disabled={!this.state.validTransferAddress}
                    variant="raised" color="secondary">
                    Transfer
                    </Button>
                }
                txTrackingId={this.state.txTrackingId}
                loadingWeb3={!hasWeb3}
            >

                {/* TODO Preview Pepe with image etc. */}
                <DialogContentText>
                    Transfer pepe #{pepe.pepeId} to another wallet. This cannot be reverted!
                </DialogContentText>

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
    pepe: PropTypes.shape({
        name: PropTypes.string,
        pepeId: PropTypes.string
    }).isRequired
};

const styledTransferDialog = withStyles(styles)(TransferDialog);

export default connect(state => ({
    hasWeb3: state.web3.hasWeb3,
    PepeBase: state.redapp.contracts.PepeBase
}))(styledTransferDialog);

