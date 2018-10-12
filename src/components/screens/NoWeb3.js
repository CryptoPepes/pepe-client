import React from "react";
import {withStyles} from "@material-ui/core/styles";
import {Grid, Typography} from "@material-ui/core";
import AdvancedLink from "../elements/util/AdvancedLink";
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

const NoWeb3Inner = ({classes}) => (
    <div className={classes.root}>
        <Grid container spacing={40} justify="center">
            <Grid item xs={12}>
                <Grid container justify="center">
                    <Grid item>
                        <Typography variant="display3" component="h2">
                            No Web3 detected.
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={10} md={8} lg={6}>
                <Grid container>
                    <Grid item xs={12} className={classes.mainContent}>
                        <Typography variant="title" component="h3">
                            Install Metamask to get started!
                        </Typography>
                        <br/>
                        <Typography variant="body1" component="p">
                            See the <AdvancedLink to="/faq" disableLinkPadding
                                                  variant="body2" className={classes.link}>
                            Frequently Asked Questions</AdvancedLink> on how to install Metamask,
                            a user-friendly Web3 wallet provider for in your web browser.<br/>
                            <i>Other web3 wallets are also supported, but may be less user friendly or harder to troubleshoot.</i>
                        </Typography>
                        <br/>
                        <Typography variant="title" component="h3">
                            Already have Metamask or another Web3 wallet?
                        </Typography>
                        <br/>
                        <Typography variant="body1" component="p">
                            Make sure your wallet is ON. If you want to interact with this DApp you need
                            to log into your wallet, so that we know which ethereum address you use. If you're
                            logged in, and nothing happens, <strong>then refresh the page</strong>, and then try navigating
                            to your <AdvancedLink to="/my-pepes" disableLinkPadding variant="body2" className={classes.link}>
                            pepe portfolio
                        </AdvancedLink>.
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </div>
);

const NoWeb3 = ({classes}) => {
    return <Web3StatusRedirector dstNoWeb3={() => <NoWeb3Inner classes={classes}/>}/>;
};

export default withStyles(styles)(NoWeb3);
