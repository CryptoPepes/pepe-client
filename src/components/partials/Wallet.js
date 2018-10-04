import React from 'react';
import {withStyles} from "@material-ui/core/styles";
import {
    Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, ListSubheader, Button
} from "@material-ui/core";
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import walletActionTypes from "../../reducers/wallet/walletActionTypes";
import CloseIcon from '@material-ui/icons/Close';
import BroadcastingTxList from "../elements/wallet/BroadcastingTxList";
import ProcessedTxList from "../elements/wallet/ProcessedTxList";
import EthAccount from "../elements/util/EthAccount";
import Web3Utils from "web3-utils";
import ChangeUsernameDialog from "../elements/actions/ChangeUsernameDialog";
import Web3Loading from "../elements/util/Web3Loading";


const styles = theme => ({
    root: {
        width: "240px",
    },
    accountMetaInfo: {
        display: "flex",
        justifyContent: "space-between"
    },
    balance: {
        ...theme.typography.body2,
        color: theme.palette.type === "light" ? "#373" : "#bfb"
    },
    portfolioLink: {
        ...theme.typography.body1
    }
});

class Wallet extends React.Component {

    constructor() {
        super();
        this.state = {
            // Change username dialog toggle states will be added on the fly
        };
    }

    handleWalletToggle = () => {
        this.props.dispatch({
            type: walletActionTypes.WALLET_TOGGLE_DRAWER
        });
    };

    handleDialogBtn = (dialogId, open) => () => {
        this.setState({
            [dialogId]: open
        });
    };


    render() {
        const {classes, walletUI, hasWeb3, wallet} = this.props;

        const balanceList = [];

        if (hasWeb3 && !!wallet) {
            // console.log("accounts:");
            // console.log(accounts);
            // console.log("balances:");
            // console.log(accountBalances);
            for (let addr of Object.keys(wallet)) {
                const addrData = wallet[addr];
                const balance = addrData.balance;
                balanceList.push([addr, balance]);
            }
        }

        return (
            <Drawer className={classes.root} anchor="right" open={!!walletUI && walletUI.openDrawer}
                    onClose={this.handleWalletToggle}>
                <List>
                    <ListItem button onClick={this.handleWalletToggle}>
                        <ListItemIcon>
                            <CloseIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Close wallet"/>
                    </ListItem>

                    <Divider/>

                    {!hasWeb3 && <Web3Loading variant="bar-tag"/>}
                    {!hasWeb3 && <Divider/>}

                    <ListSubheader>Accounts</ListSubheader>
                        {balanceList.map(([addr, balance]) => {

                            const openStateName = "ChangeUsernameOpen"+addr;
                            return (
                                <ListItem key={addr}>

                                    <EthAccount address={addr}>
                                    <span className={classes.accountMetaInfo}>
                                        <Link className={classes.portfolioLink}
                                              to={"/portfolio/" + addr.toLowerCase()}>Open portfolio</Link>
                                        <span
                                            className={classes.balance}>Ξ {Web3Utils.fromWei(balance, "ether")}</span>
                                    </span>
                                    </EthAccount>

                                    <Button variant="raised" color="secondary"
                                            className={classes.button}
                                            onClick={this.handleDialogBtn(openStateName, true)}>
                                        Change name
                                    </Button>

                                    <ChangeUsernameDialog open={!!this.state[openStateName]}
                                                          onClose={this.handleDialogBtn(openStateName, false)}
                                                          address={addr} />

                                </ListItem>
                            );
                        })}
                    <Divider/>
                </List>

                <BroadcastingTxList/>
                <ProcessedTxList/>
            </Drawer>
        );
    }
}


const styledWallet = withStyles(styles)(Wallet);


const ConnectedWallet = connect(state => ({
    walletUI: state.wallet,
    hasWeb3: state.hasWeb3,
    wallet: state.redapp.tracking.accounts.wallet
}))(styledWallet);


export default ConnectedWallet;

