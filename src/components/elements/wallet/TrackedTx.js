import React from "react";
import {withStyles} from "@material-ui/core/styles";
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import TxListItem from "./TxListItem";

const styles = (theme) => ({
    root: {

    }
});

class TrackedTxInner extends React.Component {


    render() {
        const {hasWeb3, txTracked, transaction, classes} = this.props;

        let txStatus = "broadcasting";
        if (!!transaction) {
            if (transaction.status === "pending") txStatus = "pending";
            else if (transaction.status === "success") txStatus = "confirmed";
            else if (transaction.status === "error") txStatus = "error";
            // Other transaction status are considered invalid,
            //  and fallback "broadcasting" will be used.
        }

        const confirmations = txStatus === "confirmed"
            ? (transaction.confirmations.length + 1)// +1, count the block of the TX itself.
            : undefined;

        return (
            <div className={classes.root}>
                    {
                        (hasWeb3 && !!txTracked && txTracked.info)
                        ? <TxListItem
                            status={txStatus}
                            confirmations={confirmations}
                            txHash={txTracked.hash}
                            txInfo={txTracked.info}/>
                        : <div>Loading...</div>
                    }
            </div>
        )
    }

}


const styledTrackedTx = withStyles(styles)(TrackedTxInner);

const TrackedTx = connect((state, props) => {
    const trackedData = state.transactionTracker[props.txTrackingId];
    const txData = (!trackedData || !trackedData.hash) ? null : (state.transactions[trackedData.hash]);
    return ({
        hasWeb3: state.web3.hasWeb3,
        txTracked: trackedData,
        transaction: txData
    });
})(styledTrackedTx);

TrackedTx.propTypes = {
    txTrackingId: PropTypes.string.isRequired
};

export default TrackedTx;
