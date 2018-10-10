import React from "react";
import {withStyles} from "@material-ui/core/styles";
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import TxListItem from "./TxListItem";
import decodeTx from "../../../decode/decodeTx";

const styles = (theme) => ({
    root: {

    }
});

class TrackedTxInner extends React.Component {


    render() {
        const {hasWeb3, transaction, confirmations, onRemove, classes} = this.props;

        let receipt = null;
        let hash = "";
        let txStatus = "sent";
        if (!!transaction) {
            receipt = transaction.receipt;
            hash = transaction.hash;
            txStatus = transaction.status;
        }

        const decodedTx = decodeTx(receipt);
        return (
            <div className={classes.root}>
                    {
                        (hasWeb3)
                        ? <TxListItem
                            onRemove={onRemove}
                            status={txStatus}
                            confirmations={confirmations}
                            txHash={hash}
                            decodedTx={decodedTx}/>
                        : <div>Loading...</div>
                    }
            </div>
        )
    }

}


const styledTrackedTx = withStyles(styles)(TrackedTxInner);

const TrackedTx = connect((state, props) => {
    const txData = state.redapp.tracking.transactions[props.txTrackingId];
    const confirmations = txData.status === "confirmed" ? (state.redapp.tracking.blocks.latest.number - txData.blockNumber + 1) : 0;
    // TODO check if it's not in an orphaned block
    return ({
        hasWeb3: state.web3.hasWeb3,
        transaction: txData,
        confirmations
    });
})(styledTrackedTx);

TrackedTx.propTypes = {
    txTrackingId: PropTypes.string.isRequired,
    // Optional listener, if present, the list item shows a remove icon, to hook removal to.
    onRemove: PropTypes.func
};

export default TrackedTx;
