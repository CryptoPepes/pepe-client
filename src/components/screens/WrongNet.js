import React from "react";
import {withStyles} from "@material-ui/core/styles";
import {Grid, Typography} from "@material-ui/core";
import { targetNetID } from "../../web3Settings";
import Web3StatusRedirector from "./Web3StatusRedirector";

const styles = theme => ({
    root: {
        flex: '1 0 100%',
        marginTop: 8 * theme.spacing.unit
    },
    mainContent: {
        textAlign: "center",
        paddingBottom: 500
    },
    link: {
        textDecoration: "underline"
    }
});

function getNetName(networkID) {
    if (networkID === 1) return 'main-net';
    if (networkID === 3) return 'Ropsten test-net';
    return 'unknown network';
}

const WrongNetInner = ({classes, networkID}) => (
    <div className={classes.root}>
        <Grid container spacing={40} justify="center">
            <Grid item xs={12}>
                <Grid container justify="center">
                    <Grid item>
                        <Typography variant="display3" component="h2">
                            Web3 connected to other Ethereum network.
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={10} md={8} lg={6}>
                <Grid container>
                    <Grid item xs={12} className={classes.mainContent}>
                        <Typography variant="body1" component="p">
                            Your Web3 wallet is connected, but to the wrong network. Please switch it to network {
                            getNetName(targetNetID)} (network ID: {targetNetID}).
                        </Typography>

                        <br/>
                        <Typography variant="body1" component="p">
                            You are currently connected to {getNetName(networkID)} (network ID: {networkID}).
                        </Typography>

                        <br/>
                        <Typography variant="body1" component="p">
                            Feel free to ask on the telegram group for support, if you cannot find the network setting.
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </div>
);

const WrongNet = ({classes}) => {
    return <Web3StatusRedirector dstWrongNet={(networkID) => <WrongNetInner classes={classes} networkID={networkID}/>}/>;
};


export default withStyles(styles)(WrongNet);
