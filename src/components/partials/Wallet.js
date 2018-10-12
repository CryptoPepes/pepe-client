import React from 'react';
import {withStyles} from "@material-ui/core/styles";
import {
    Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, ListSubheader, Button, Typography, Grid
} from "@material-ui/core";
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import walletActionTypes from "../../reducers/wallet/walletActionTypes";
import CloseIcon from '@material-ui/icons/Close';
import LiveTxList from "../elements/wallet/LiveTxList";
import EthAccount from "../elements/util/EthAccount";
import ChangeUsernameDialog from "../elements/actions/ChangeUsernameDialog";
import PriceText from "../elements/util/PriceText";
import Web3StatusRedirector from "../screens/Web3StatusRedirector";
import AdvancedLink from "../elements/util/AdvancedLink";


const walletInnerStyles = theme => ({
    root: {
        width: "240px",
    },
    accountMetaInfo: {
        display: "flex",
        justifyContent: "space-between"
    },
    balance: {
        ...theme.typography.body2,
        color: theme.palette.type === "light" ? "#373" : "#bfb",
        maxWidth: 140,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    portfolioLink: {
        ...theme.typography.body1
    }
});

class WalletInner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // Change username dialog toggle states will be added on the fly
        };
    }

    handleDialogBtn = (dialogId, open) => () => {
        this.setState({
            [dialogId]: open
        });
    };

    render() {
        const {wallet, classes} = this.props;

        const balanceList = [];

        if (!!wallet) {
            // console.log("accounts:");
            // console.log(accounts);
            // console.log("balances:");
            // console.log(accountBalances);
            for (let addr of Object.keys(wallet)) {
                const addrData = wallet[addr];
                const balance = addrData.balance;
                // Note: balance may be null, since it is loaded with a different web3 call than the account
                balanceList.push([addr, balance]);
            }
        }

        return (
            <div>
                <ListSubheader>Accounts</ListSubheader>
                {balanceList.map(([addr, balance]) => {

                    const openStateName = "ChangeUsernameOpen"+addr;
                    return (
                        <ListItem key={addr}>

                            <Grid container spacing={0}>
                                <Grid item sm={12} md={8} lg={10}>
                                    <EthAccount address={addr}>
                                                        <span className={classes.accountMetaInfo}>
                                                            <Link className={classes.portfolioLink}
                                                                  to={"/portfolio/" + addr.toLowerCase()}>Open portfolio</Link>
                                                            <PriceText className={classes.balance} priceWei={balance}/>
                                                        </span>
                                    </EthAccount>
                                </Grid>

                                <Grid item sm={12} md={4} lg={2}>

                                    <Button variant="raised" color="secondary"
                                            className={classes.button}
                                            onClick={this.handleDialogBtn(openStateName, true)}>
                                        Change name
                                    </Button>

                                    <ChangeUsernameDialog open={!!this.state[openStateName]}
                                                          onClose={this.handleDialogBtn(openStateName, false)}
                                                          address={addr} />
                                </Grid>
                            </Grid>

                        </ListItem>
                    );
                })}
                <Divider/>
                <LiveTxList/>
            </div>
        );
    }

}

const styledWalletInner = withStyles(walletInnerStyles)(WalletInner);

const ConnectedWalletInner = connect(state => ({
    wallet: state.redapp.tracking.accounts.wallet
}))(styledWalletInner);

const explainerStyles = theme => ({
    root: {
        width: "100%",
        margin: theme.spacing.unit * 2
    }
});

const ExplainerEl = ({reasonText, moreLink, moreLinkText, classes}) => (
    <div className={classes.root}><Typography variant="body2">{reasonText}</Typography><br/>
        <AdvancedLink to={moreLink} disableLinkPadding>
            <span style={{color: "#F79220"}}>{moreLinkText}</span>
        </AdvancedLink>
    </div>
);

const StyledExplainer = withStyles(explainerStyles)(ExplainerEl);

const walletStyles = theme => ({
    root: {
        width: "240px",
    }
});

class Wallet extends React.Component {

    handleWalletToggle = () => {
        this.props.dispatch({
            type: walletActionTypes.WALLET_TOGGLE_DRAWER
        });
    };


    render() {
        const {classes, walletUI} = this.props;


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
                    <Web3StatusRedirector dstAddrOk={() => <ConnectedWalletInner/>}
                                          dstNoWeb3={() =>
                                              <StyledExplainer reasonText="Not connected to Web3." moreLink="/no-web3" moreLinkText={"Read more"}/>
                                          }
                                          dstNoAccount={() =>
                                              <StyledExplainer reasonText="Not logged in." moreLink="/no-account" moreLinkText={"Read more"}/>
                                          }
                                          dstWrongNet={() =>
                                              <StyledExplainer reasonText="Web3 active, wrong network." moreLink="/wrong-net" moreLinkText={"Read more"}/>
                                          }/>
                </List>

            </Drawer>
        );
    }
}


const styledWallet = withStyles(walletStyles)(Wallet);


const ConnectedWallet = connect(state => ({
    walletUI: state.wallet,
}))(styledWallet);


export default ConnectedWallet;

