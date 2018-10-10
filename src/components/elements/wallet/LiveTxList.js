import React from "react";
import {withStyles} from "@material-ui/core/styles";
import {List, ListItemText, ListItem, Collapse} from "@material-ui/core";
import {connect} from 'react-redux';
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import TrackedTx from "./TrackedTx";
import {forgetTX} from 'redapp/es/tracking/transactions/actions';

const styles = (theme) => ({});

class LiveTxList extends React.Component {


    constructor() {
        super();

        this.state = {
            openConfirmed: false,
            openFailing: false,
            openPending: false,
            openSent: false
        };
    }

    toggleOpen = (toggleName) => () => {
        this.setState((prevState) => ({
            [toggleName]: !prevState[toggleName]
        }));
    };

    handleRemove = (trackingId) => () => {
        this.props.dispatch(forgetTX(trackingId));
    };

    render() {
        const {hasWeb3, transactions, classes} = this.props;

        const sent = [];
        const broadcast = [];
        const pending = [];
        const confirmed = [];
        const failed = [];
        if (hasWeb3) {
            for (const trackingId in transactions) {
                if (transactions.hasOwnProperty(trackingId)) {
                    const data = transactions[trackingId];

                    let targetList = null;
                    if (data.status === 'sent') {
                        targetList = sent;
                    } else if (data.status === "success") { // Mined in a block
                        targetList = confirmed;
                    } else if (data.status === "broadcast") {
                        targetList = broadcast;
                    } else if (data.status === "pending") {
                        targetList = pending;
                    } else if (data.status === "error") {
                        targetList = failed;
                    }
                    if (targetList) targetList.push(<TrackedTx key={trackingId} txTrackingId={trackingId}
                                                               onRemove={this.handleRemove(trackingId)}/>);
                }
            }
        }

        // In reverse order; end of the list was added last -> most recent tx on top of the listing.
        return (
            <List dense>
                <ListItem button onClick={this.toggleOpen("openSent")}>
                    <ListItemText secondary="Created transactions"/>
                    {this.state.openSent ? <ExpandLess/> : <ExpandMore/>}
                </ListItem>
                <Collapse in={this.state.openSent} timeout="auto" unmountOnExit>
                    <List component="div" dense disablePadding>
                        {hasWeb3 && sent.reverse()}
                        {sent.length === 0 && <ListItemText inset secondary="No created transactions."/>}
                    </List>
                </Collapse>
                <ListItem button onClick={this.toggleOpen("openBroadcast")}>
                    <ListItemText secondary="Broadcast transactions"/>
                    {this.state.openBroadcast ? <ExpandLess/> : <ExpandMore/>}
                </ListItem>
                <Collapse in={this.state.openBroadcast} timeout="auto" unmountOnExit>
                    <List component="div" dense disablePadding>
                        {hasWeb3 && broadcast.reverse()}
                        {broadcast.length === 0 && <ListItemText inset secondary="No broadcast transactions."/>}
                    </List>
                </Collapse>
                <ListItem button onClick={this.toggleOpen("openPending")}>
                    <ListItemText secondary="Pending transactions"/>
                    {this.state.openPending ? <ExpandLess/> : <ExpandMore/>}
                </ListItem>
                <Collapse in={this.state.openPending} timeout="auto" unmountOnExit>
                    <List component="div" dense disablePadding>
                        {hasWeb3 && pending.reverse()}
                        {pending.length === 0 && <ListItemText inset secondary="No pending transactions."/>}
                    </List>
                </Collapse>

                <ListItem button onClick={this.toggleOpen("openFailed")}>
                    <ListItemText secondary="Failed transactions"/>
                    {this.state.openFailed ? <ExpandLess/> : <ExpandMore/>}
                </ListItem>
                <Collapse in={this.state.openFailed} timeout="auto" unmountOnExit>
                    <List component="div" dense disablePadding>
                        {hasWeb3 && failed.reverse()}
                        {failed.length === 0 && <ListItemText inset secondary="No failed transactions."/>}
                    </List>
                </Collapse>

                <ListItem button onClick={this.toggleOpen("openConfirmed")}>
                    <ListItemText secondary="Confirmed transactions"/>
                    {this.state.openConfirmed ? <ExpandLess/> : <ExpandMore/>}
                </ListItem>
                <Collapse in={this.state.openConfirmed} timeout="auto" unmountOnExit>
                    <List component="div" dense disablePadding>
                        {hasWeb3 && confirmed.reverse()}
                        {confirmed.length === 0 && <ListItemText inset secondary="No confirmed transactions."/>}
                    </List>
                </Collapse>
            </List>


        );
    }

}


const styledLiveTxList = withStyles(styles)(LiveTxList);

export default connect(state => ({
    hasWeb3: state.web3.hasWeb3,
    transactions: state.redapp.tracking.transactions
}))(styledLiveTxList);

