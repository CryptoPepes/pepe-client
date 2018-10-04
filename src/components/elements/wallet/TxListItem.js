import React, {Component} from "react";
import {
    ListItem,
    ListItemIcon,
    ListItemText,
    Collapse,
    List,
    ListSubheader,
    Typography,
    ListItemSecondaryAction,
    Tooltip
} from "@material-ui/core";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import EthAccount from "../util/EthAccount";
import {
    CloudUpload,
    Done, DoneAll,
    ExpandLess,
    ExpandMore, HourglassEmpty, Warning, Remove
} from "@material-ui/icons";
import Web3Utils from "web3-utils";
import Moment from 'react-moment';
import EtherscanBtn from "../util/EtherscanBtn";
import PepeGridItemLoadable from "../grid/PepeGridItemLoadable";
import PriceText from "../util/PriceText";

const styles = theme => ({
    heading: {
        ...theme.typography.headline,
        fontSize: '1.3rem'
    },
    text: {
        ...theme.typography.body1,
        fontSize: '1rem'
    },
    detailList: {
        // dense spacing between items
        paddingTop: 0,
        paddingBottom: theme.spacing.unit,
        // Disable line-height
        lineHeight: "inherit",
        // nesting indentation
        paddingLeft: theme.spacing.unit * 4,
    },
    priceText: {
        ...theme.typography.body1
    },
    txHash: {
        maxWidth: 120,
        overflow: "hidden",
        display: "inline-block",
        textOverflow: "ellipsis"
    },
    sideBtn: {
        color: theme.palette.type === "light" ? "rgba(0, 0, 0, 0.54)" : "#fff",
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    }
});

class TxListItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false
        };
    }

    toggleOpen = () => {
        this.setState({ open: !this.state.open });
    };

    txInfoRenderers = {
        "TRANSFER": (txInfo, classes) => (
            <List component="div" disablePadding dense>
                <ListSubheader className={classes.detailList}>Pepe:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <PepeGridItemLoadable pepeId={txInfo.pepe}/>
                </ListItem>
                <ListSubheader className={classes.detailList}>From:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <EthAccount address={txInfo.from} small/>
                </ListItem>
                <ListSubheader className={classes.detailList}>To:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <EthAccount address={txInfo.to} small/>
                </ListItem>
            </List>
        ),
        "NAME_PEPE": (txInfo, classes) => (
            <List component="div" disablePadding dense>
                <ListSubheader className={classes.detailList}>From:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <EthAccount address={txInfo.from} small/>
                </ListItem>
                <ListSubheader className={classes.detailList}>Pepe:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <PepeGridItemLoadable pepeId={txInfo.pepe}/>
                </ListItem>
                <ListSubheader className={classes.detailList}>Name:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <Typography variant="title">{!txInfo.nameHex ? "?" : Web3Utils.hexToUtf8(txInfo.nameHex)}</Typography>
                </ListItem>
            </List>
        ),
        "NAME_USER": (txInfo, classes) => (
            <List component="div" disablePadding dense>
                <ListSubheader className={classes.detailList}>Account:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <EthAccount address={txInfo.from} small/>
                </ListItem>
                <ListSubheader className={classes.detailList}>Name:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <Typography variant="title">{!txInfo.nameHex ? "?" : Web3Utils.hexToUtf8(txInfo.nameHex)}</Typography>
                </ListItem>
            </List>
        ),
        "BREED": (txInfo, classes) => (
            <List component="div" disablePadding dense>
                <ListSubheader className={classes.detailList}>From:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <EthAccount address={txInfo.from} small/>
                </ListItem>
                <ListSubheader className={classes.detailList}>Mother:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <PepeGridItemLoadable pepeId={txInfo.motherPepe}/>
                </ListItem>
                <ListSubheader className={classes.detailList}>Father:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <PepeGridItemLoadable pepeId={txInfo.fatherPepe}/>
                </ListItem>
            </List>
        ),
        "SALE_AUCTION_BUY": (txInfo, classes) => (
            <List component="div" disablePadding dense>
                <ListSubheader className={classes.detailList}>Pepe:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <PepeGridItemLoadable pepeId={txInfo.pepe}/>
                </ListItem>
                <ListSubheader className={classes.detailList}>Buying account:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <EthAccount address={txInfo.from} small/>
                </ListItem>
                <ListSubheader className={classes.detailList}>Price:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <PriceText priceWei={txInfo.bidPrice} className={classes.priceText}/>
                </ListItem>
            </List>
        ),
        "COZY_AUCTION_BUY": (txInfo, classes) => (
            <List component="div" disablePadding dense>
                <ListSubheader className={classes.detailList}>Buying account:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <EthAccount address={txInfo.from} small/>
                </ListItem>
                <ListSubheader className={classes.detailList}>Hoppin' Pepe:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <PepeGridItemLoadable pepeId={txInfo.auctionSubject}/>
                </ListItem>
                <ListSubheader className={classes.detailList}>Candidate Pepe:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <PepeGridItemLoadable pepeId={txInfo.cozyCandidate}/>
                </ListItem>
                <ListSubheader className={classes.detailList}>Price:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <PriceText priceWei={txInfo.bidPrice} className={classes.priceText}/>
                </ListItem>
            </List>
        ),
        "SALE_AUCTION_START": (txInfo, classes) => (
            <List component="div" disablePadding dense>
                <ListSubheader className={classes.detailList}>from:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <EthAccount address={txInfo.from} small/>
                </ListItem>
                <ListSubheader className={classes.detailList}>Pepe:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <PepeGridItemLoadable pepeId={txInfo.pepe}/>
                </ListItem>
                <ListSubheader className={classes.detailList}>Start price:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <PriceText priceWei={txInfo.startPrice} className={classes.priceText}/>
                </ListItem>
                <ListSubheader className={classes.detailList}>End price:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <PriceText priceWei={txInfo.endPrice} className={classes.priceText}/>
                </ListItem>
                <ListSubheader className={classes.detailList}>Duration:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <Typography variant="body1">
                        <Moment unix to={txInfo.duration} ago interval={0}>0</Moment>
                    </Typography>
                </ListItem>
            </List>
        ),
        "COZY_AUCTION_START": (txInfo, classes) => (
            <List component="div" disablePadding dense>
                <ListSubheader className={classes.detailList}>from:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <EthAccount address={txInfo.from} small/>
                </ListItem>
                <ListSubheader className={classes.detailList}>Pepe:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <PepeGridItemLoadable pepeId={txInfo.pepe}/>
                </ListItem>
                <ListSubheader className={classes.detailList}>Start price:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <PriceText priceWei={txInfo.startPrice} className={classes.priceText}/>
                </ListItem>
                <ListSubheader className={classes.detailList}>End price:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <PriceText priceWei={txInfo.endPrice} className={classes.priceText}/>
                </ListItem>
                <ListSubheader className={classes.detailList}>Duration:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <Typography variant="body1">
                        <Moment unix to={txInfo.duration} ago interval={0}>0</Moment>
                    </Typography>
                </ListItem>
            </List>
        ),
        "SAVE_PEPE":  (txInfo, classes) => (
            <List component="div" disablePadding dense>
                <ListSubheader className={classes.detailList}>from:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <EthAccount address={txInfo.from} small/>
                </ListItem>
                <ListSubheader className={classes.detailList}>Pepe:</ListSubheader>
                <ListItem className={classes.detailList}>
                    <PepeGridItemLoadable pepeId={txInfo.pepe}/>
                </ListItem>
            </List>
        ),
    };

    getElementForTxInfo = (txInfo, classes) => {
        if (!txInfo) return null;
        const renderer = this.txInfoRenderers[txInfo.type];
        if (!renderer) return null;
        else return renderer(txInfo, classes);
    };


    txInfoTitleMakers = {
        "TRANSFER": (txInfo) => `Transfer pepe #${txInfo.pepe}`,
        "NAME_PEPE": (txInfo) => `Name pepe #${txInfo.pepe}: ${!txInfo.nameHex ? "?" : Web3Utils.hexToUtf8(txInfo.nameHex)}`,
        "NAME_USER": (txInfo) => `Change username to ${!txInfo.nameHex ? "?" : Web3Utils.hexToUtf8(txInfo.nameHex)}`,
        "BREED": (txInfo) => `Hop pepe #${txInfo.motherPepe} with #${txInfo.fatherPepe}`,
        "SALE_AUCTION_BUY": (txInfo) => `Buy pepe #${txInfo.pepe}`,
        "COZY_AUCTION_BUY": (txInfo) => `Buy cozy-time with pepe #${txInfo.auctionSubject} for pepe #${txInfo.cozyCandidate}`,
        "SALE_AUCTION_START": (txInfo) => `Start sale auction: sell pepe #${txInfo.pepe}`,
        "COZY_AUCTION_START": (txInfo) => `Start cozy auction: hop pepe #${txInfo.pepe}`,
        "SAVE_PEPE": (txInfo) => `Retrieve pepe #${txInfo.pepe} from expired auction`
    };

    getTitleForTxInfo = (txInfo) => {
        if (!txInfo) return null;
        const maker = this.txInfoTitleMakers[txInfo.type];
        if (!maker) return null;
        else return maker(txInfo);
    };

    render() {
        const {status, confirmations, txHash, txInfo, onRemove, classes} = this.props;
        
        let statusText = "";
        let statusIcon = null;
        switch (status) {
            case "broadcasting":
                statusText = "Broadcasting...";
                statusIcon = <CloudUpload/>;
                break;
            case "pending":
                statusText = "Pending confirmation";
                statusIcon = <HourglassEmpty/>;
                break;
            case "confirmed":
                statusText = (!confirmations ? "0 confirmations" : (
                    confirmations === 1 ? "1 confirmation" : (confirmations + " confirmations")));
                statusIcon = !!confirmations && confirmations >= 12 ? <DoneAll/> : <Done/>;
                break;
            case "error":
                statusText = "Erroneous TX!";
                statusIcon = <Warning/>;
                break;
            default:
                statusText = "Unknown";
                break;
        }

        const txInfoEl = this.getElementForTxInfo(txInfo, classes);

        // txInfo.title can override the title generated from the txInfo
        const title = txInfo.title || this.getTitleForTxInfo(txInfo);

        return (
            <div>
                <ListItem button onClick={this.toggleOpen}>
                    {statusIcon &&
                        <ListItemIcon>
                            {statusIcon}
                        </ListItemIcon>
                    }
                    <ListItemText inset primary={title} secondary={statusText} />
                    {this.state.open ? <ExpandLess className={classes.sideBtn}/> : <ExpandMore className={classes.sideBtn} />}

                    {onRemove && <ListItemSecondaryAction>
                        <Tooltip id="tx-remove" title="Remove transaction from history" enterDelay={200}>
                            <Remove aria-labelledby="tx-remove" onClick={onRemove} className={classes.sideBtn}/>
                        </Tooltip>
                    </ListItemSecondaryAction>}
                </ListItem>

                <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                    {txHash &&
                        <List component="div" disablePadding dense>
                            <ListSubheader className={classes.detailList}>TX Hash:</ListSubheader>
                            <ListItem className={classes.detailList}>
                                <ListItemText inset primary={<code className={classes.txHash}>{txHash}</code>} />
                                <EtherscanBtn link={"/tx/"+txHash}>Check Etherscan</EtherscanBtn>
                            </ListItem>
                        </List>
                    }

                    {txInfoEl}
                </Collapse>

            </div>
        )
    }

}

TxListItem.propTypes = {
    classes: PropTypes.object.isRequired,
    // Status options: "broadcasting", "pending", "confirmed", "error"
    status: PropTypes.string.isRequired,
    // Optional, used if status is "confirmed"
    confirmations: PropTypes.number,
    txHash: PropTypes.string,
    txInfo: PropTypes.shape({
        type: PropTypes.string.isRequired,
        from: PropTypes.string.isRequired
        // Other fields are dependent on type
    }).isRequired,
    // Optional listener, if present, the list item shows a remove icon, to hook removal to.
    onRemove: PropTypes.func
};

export default withStyles(styles)(TxListItem);
