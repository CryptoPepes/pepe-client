import React from "react";
import {withStyles} from "@material-ui/core/styles";
import {List, ListItemText, ListItem, Collapse} from "@material-ui/core";
import { connect } from 'react-redux';
import TxListItem from "./TxListItem";
import {ExpandLess, ExpandMore} from "@material-ui/icons";

const styles = (theme) => ({

});

const unknownInfo = {title: "Unknown", from: undefined, to: undefined};

class ProcessedTxList extends React.Component {


    constructor() {
        super();

        this.state = {
            openConfirmed: false,
            openFailing: false,
            openPending: false
        };
    }

    toggleOpen = (toggleName) => () => {
        this.setState((prevState) => ({
            [toggleName]: !prevState[toggleName]
        }));
    };

    handleRemove = (trackingId) => () => {

        const trackedData = this.props.transactionTracker[trackingId];

        this.props.dispatch({
            type: "FORGET_TX",
            trackingId: trackingId,
            // Also forget the TX state, not just the tracked data.
            hash: !trackedData ? undefined : trackedData.txHash
        });
    };

    render() {
        const {hasWeb3, transactions, transactionTracker, classes} = this.props;

        const confirmed = [];
        const failed = [];
        const pending = [];
        if (hasWeb3) {
            for (const txHash in transactions) {
                if (transactions.hasOwnProperty(txHash)) {
                    const data = transactions[txHash];
                    const trackedData = transactionTracker[data.trackingId];

                    // Skip if we don't have data about this TX
                    if (!trackedData) continue;

                    if (data.status === "success") {
                        confirmed.push(<TxListItem key={txHash}
                                            status="confirmed"
                                            confirmations={data.confirmations.length + 1}// +1, count the block of the TX itself.
                                            txHash={txHash}
                                            txInfo={trackedData.info || unknownInfo}
                                            onRemove={this.handleRemove(data.trackingId)}/>);
                    } else if (data.status === "pending") {
                        pending.push(<TxListItem key={txHash}
                                           status="pending"
                                           txHash={txHash}
                                           txInfo={trackedData.info || unknownInfo}
                                           onRemove={this.handleRemove(data.trackingId)}/>);
                    } else if (data.status === "error") {
                        failed.push(<TxListItem key={txHash}
                                           status="error"
                                           txHash={txHash}
                                           txInfo={trackedData.info || unknownInfo}
                                           onRemove={this.handleRemove(data.trackingId)}/>);
                    }
                }
            }
        }

        // In reverse order; end of the list was added last -> most recent tx on top of the listing.
        return (
            <List dense>
                <ListItem button onClick={this.toggleOpen("openPending")}>
                    <ListItemText secondary="Pending transactions" />
                    {this.state.openPending ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.openPending} timeout="auto" unmountOnExit>
                    <List component="div" dense disablePadding>
                        {hasWeb3 && pending.reverse()}
                        {pending.length === 0 && <ListItemText inset secondary="No pending transactions." />}
                    </List>
                </Collapse>

                <ListItem button onClick={this.toggleOpen("openFailed")}>
                    <ListItemText secondary="Failed transactions" />
                    {this.state.openFailed ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.openFailed} timeout="auto" unmountOnExit>
                    <List component="div" dense disablePadding>
                        {hasWeb3 && failed.reverse()}
                        {failed.length === 0 && <ListItemText inset secondary="No failed transactions." />}
                    </List>
                </Collapse>

                <ListItem button onClick={this.toggleOpen("openConfirmed")}>
                    <ListItemText secondary="Confirmed transactions" />
                    {this.state.openConfirmed ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.openConfirmed} timeout="auto" unmountOnExit>
                    <List component="div" dense disablePadding>
                        {hasWeb3 && confirmed.reverse()}
                        {confirmed.length === 0 && <ListItemText inset secondary="No confirmed transactions." />}
                    </List>
                </Collapse>
            </List>


        );
    }

}


const styledConfirmedTxList = withStyles(styles)(ProcessedTxList);

export default connect(state => ({
    hasWeb3: state.hasWeb3,
    transactions: state.transactions,
    transactionTracker: state.transactionTracker
}))(styledConfirmedTxList);

