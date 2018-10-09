import React from "react";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {
    Button,
    DialogContentText,
    TextField,
} from "@material-ui/core";
import { connect } from 'react-redux';
import Web3Utils from "web3-utils";
import EthAccount from "../util/EthAccount";
import TxDialog from "./TxDialog";

const styles = (theme) => ({

});

class ChangeUsernameDialog extends React.Component {

    constructor(props) {
        super();

        this.state = {
            usernameHexStr: "",
            validUsername: false,
            // undefined as long as tx is not sent
            txTrackingId: undefined,
            lastUsername: ""
        }
    }

    /**
     * Checks if the value of the given input event is a valid username, updates the state.
     * @param ev The input event
     */
    handleUsernameInput = (ev) => {

        const username = ev.target.value;

        console.log(ev);

        // short circuit to exit if we already handled the username.
        if (username === this.state.lastUsername) return;

        if (username === undefined || username === null || username.length === 0 || username.length > 32) {
            // note that some "falsy" values are valid usernames (e.g. "0", or "false").
            this.setState({
                usernameHexStr: "",
                validUsername: false,
                lastUsername: username
            });
            return;
        }

        // username must be 32 bytes or less;
        // 32 chars can take up more bytes (due to international characters)
        const hexUsername = Web3Utils.utf8ToHex(username);
        this.setState({
            usernameHexStr: hexUsername,
            validUsername: hexUsername.length <= 66, // 2 hex chars per byte, +2 for the "0x" hex prefix.
            lastUsername: username
        });
    };


    handleUsernameChangeSend = () => {
        const { PepeBase, hasWeb3, address } = this.props;

        if (hasWeb3) {
            const {txID, thunk} = PepeBase.methods.claimUsername.trackedSend(
                { from: address }, this.state.usernameHexStr);

            this.setState({
                txTrackingId: txID,
            });

            this.props.dispatch(thunk);
        }
    };

    render() {
        const {open, onClose, hasWeb3, address} = this.props;

        return (
            <TxDialog
                open={open}
                onClose={onClose}
                dialogTitle={<span>Change your username</span>}
                dialogActions={
                    <Button onClick={this.handleUsernameChangeSend}
                            disabled={!this.state.validUsername}
                            variant="raised" color="secondary">
                        Change
                    </Button>
                }
                txTrackingId={this.state.txTrackingId}
                loadingWeb3={!hasWeb3}
            >
                <DialogContentText>
                    Change your username for the following account:
                </DialogContentText>

                <EthAccount address={address}/>

                <TextField
                    autoFocus
                    margin="dense"
                    label="Username"
                    type="text"
                    error={!this.state.validUsername && this.state.usernameHexStr !== ""}
                    onChange={e => this.handleUsernameInput(e)}
                    fullWidth
                />

            </TxDialog>
        );
    }

}

ChangeUsernameDialog.propTypes = {
    open: PropTypes.bool,
    address: PropTypes.string.isRequired,
    onClose: PropTypes.func
};

const styledChangeUsernameDialog = withStyles(styles)(ChangeUsernameDialog);

export default connect(state => ({
    hasWeb3: state.web3.hasWeb3,
    PepeBase: state.redapp.contracts.PepeBase
}))(styledChangeUsernameDialog);

