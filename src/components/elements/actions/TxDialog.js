import React from "react";
import PropTypes from "prop-types";
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle
} from "@material-ui/core";
import ActionDialog from "../util/Closeable";
import TrackedTx from "../wallet/TrackedTx";
import Web3Loading from "../util/Web3Loading";

/**
 * Transaction dialog, shows transaction status after sending,
 *  has support for warning/error messages.
 */
class TxDialog extends ActionDialog {

    render() {
        const {children, dialogTitle, dialogActions, extra, txTrackingId, loadingWeb3} = this.props;

        const txSent = !!txTrackingId;

        return (
            <Dialog open={this.state.isOpen}
                    onClose={this.handleOpen(false)}>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    {loadingWeb3
                        ? <Web3Loading variant="circle-tag"/>
                        : children
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleOpen(false)} color="primary">
                        { txSent ? "Close" : "Cancel" }
                    </Button>
                    {!loadingWeb3 && !txSent && dialogActions}
                </DialogActions>
                {extra &&
                    <DialogContent>
                        {extra}
                    </DialogContent>
                }
                {txSent &&
                    <DialogContent>
                        <TrackedTx txTrackingId={txTrackingId}/>
                    </DialogContent>
                }
            </Dialog>
        );
    }

}


TxDialog.defaultProps = {
    open: false,
    onClose: null,
    dialogTitle: null,
    dialogActions: null,
    txTrackingId: null,
    loadingWeb3: false,
    extra: null
};

TxDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    dialogTitle: PropTypes.element,
    dialogActions: PropTypes.element,
    txTrackingId: PropTypes.string,
    loadingWeb3: PropTypes.bool,
    extra: PropTypes.element
};

export default TxDialog;
