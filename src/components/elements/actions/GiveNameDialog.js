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

class GiveNameDialog extends React.Component {

    constructor() {
        super();

        this.state = {
            pepeNameHexStr: "",
            validPepeName: false,
            // undefined as long as tx is not sent
            txTrackingId: undefined,
            lastName: ""
        }
    }

    /**
     * Checks if the value of the given input event is a pepe name, updates the state.
     * @param ev The input event
     */
    updatePepeNameInput = (ev) => {

        const name = ev.target.value;

        // short circuit to exit if we already handled the name.
        if (name === this.state.lastName) return;

        if (name === undefined || name === null || name.length === 0 || name.length > 32) {
            // note that some "falsy" values are valid name (e.g. "0", or "false").
            this.setState({
                pepeNameHexStr: "",
                validPepeName: false,
                lastName: name
            });
            return;
        }

        // name must be 32 bytes or less;
        // 32 chars can take up more bytes (due to international characters)
        const hexName = Web3Utils.utf8ToHex(name);
        this.setState({
            pepeNameHexStr: hexName,
            validPepeName: hexName.length <= 66, // 2 hex chars per byte, +2 for the "0x" hex prefix.
            lastName: name
        });
    };


    handleTxSend = () => {
        const { PepeBase, hasWeb3, pepe } = this.props;

        if (hasWeb3 && this.state.validPepeName) {

            const {txID, thunk} = PepeBase.methods.setPepeName.trackedSend(
                {from: pepe.master}, pepe.pepeId, this.state.pepeNameHexStr);

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
                dialogTitle={<span>Name Pepe #{pepe.pepeId}</span>}
                dialogActions={
                    <Button onClick={this.handleTxSend}
                            disabled={!(hasWeb3 && this.state.validPepeName)}
                            variant="raised" color="secondary">
                        Name Pepe
                    </Button>
                }
                txTrackingId={this.state.txTrackingId}
                loadingWeb3={!hasWeb3}
            >
                {/* Preview Pepe with image etc. */}
                <DialogContentText>
                    Give a name to Pepe #{pepe.pepeId}. Once the Pepe is named it cannot be renamed!
                </DialogContentText>

                <TextField
                    autoFocus
                    margin="dense"
                    label="Pepe name"
                    type="text"
                    error={!this.state.validPepeName}
                    onChange={this.updatePepeNameInput}
                    fullWidth
                />
            </TxDialog>
        );
    }

}

GiveNameDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    pepe: PropTypes.shape({
        name: PropTypes.string,
        pepeId: PropTypes.string
    }).isRequired
};

const styledGiveNameDialog = withStyles(styles)(GiveNameDialog);

export default connect(state => ({
    hasWeb3: state.hasWeb3,
    PepeBase: state.redapp.contracts.PepeBase
}))(styledGiveNameDialog);
