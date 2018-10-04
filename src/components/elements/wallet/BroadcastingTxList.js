import React from "react";
import {withStyles} from "@material-ui/core/styles";
import {List, ListItemText, Divider, ListItem, Collapse} from "@material-ui/core";
import { connect } from 'react-redux';
import TxListItem from "./TxListItem";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import themeActionTypes from "../../../reducers/theme/themeActionTypes";

const styles = (theme) => ({

});

const unknownInfo = {title: "unknown", from: undefined, to: undefined};

class BroadcastingTxList extends React.Component {


    constructor() {
        super();

        this.state = {
            open: false
        };
    }

    toggleOpen = () => {
        this.setState((prevState) => ({
            open: !prevState.open
        }));
    };

    handleRemove = (trackingId) => () => {
        this.props.dispatch({
            type: "FORGET_TX",
            trackingId: trackingId
        });
    };

    render() {
        const {hasWeb3, transactionTracker, classes} = this.props;

        const incompleteBroadcasts = [];
        const completeBroadcasts = [];
        if (hasWeb3) {
            for (const trackingId in transactionTracker) {
                if (transactionTracker.hasOwnProperty(trackingId)) {
                    const data = transactionTracker[trackingId];
                    // Skip if the TX was already successfully broadcast.
                    if (!data.broadcasted) {
                        incompleteBroadcasts.push(<TxListItem key={trackingId}
                                                            status="broadcasting"
                                                            txInfo={data.info || unknownInfo}
                                                            onRemove={this.handleRemove(trackingId)}/>);
                    }
                }
            }
        }

        // In reverse order; end of the list was added last -> most recent tx on top of the listing.
        return (
            <List dense>
                <ListItem button onClick={this.toggleOpen}>
                    <ListItemText secondary="Broadcasting transactions" />
                    {this.state.open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                    <List component="div" dense>
                        {hasWeb3 && incompleteBroadcasts.reverse()}
                        {hasWeb3 && completeBroadcasts.reverse()}
                        {incompleteBroadcasts.length === 0
                            && completeBroadcasts.length === 0
                            && <ListItemText inset secondary="No broadcasting transactions." />}
                    </List>
                </Collapse>
            </List>
        );
    }

}


const styledBroadcastingTxList = withStyles(styles)(BroadcastingTxList);

export default connect(state => ({
    hasWeb3: state.hasWeb3,
    transactionTracker: state.transactionTracker
}))(styledBroadcastingTxList);

