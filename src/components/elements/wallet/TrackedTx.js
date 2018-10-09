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
        const {hasWeb3, transaction, confirmations, classes} = this.props;

        let txStatus = "broadcasting";
        if (!!transaction) {
            if (transaction.status === "pending") txStatus = "pending";
            else if (transaction.status === "success") txStatus = "confirmed";
            else if (transaction.status === "error") txStatus = "error";
            // Other transaction status are considered invalid,
            //  and fallback "broadcasting" will be used.
        }

        const decodedTx = decodeTx(transaction);
        return (
            <div className={classes.root}>
                    {
                        (hasWeb3)
                        ? <TxListItem
                            status={txStatus}
                            confirmations={confirmations}
                            txHash={transaction.hash}
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
        transaction: txData.receipt,
        confirmations
    });
})(styledTrackedTx);

TrackedTx.propTypes = {
    txTrackingId: PropTypes.string.isRequired
};

export default TrackedTx;
