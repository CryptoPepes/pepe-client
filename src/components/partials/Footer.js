import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import {AppBar, Hidden, Toolbar} from "@material-ui/core";
import * as classNames from 'classnames';
import AdvancedLink from "../elements/util/AdvancedLink";
import {Facebook, Instagram, Reddit, Telegram, Twitter} from "mdi-material-ui";

const styles = theme => ({
    root: {
        width: '100%',
    },
    grow: {
        flex: '1 1 auto',
    },
    containerBar: {
        backgroundColor:
            theme.palette.type === 'light' ? "white" : theme.palette.background.default,
        color: theme.typography.body2.color,
        padding: 20,
        minHeight: 100
    },
    bar: {
        justifyContent: "center",
        minHeight: "3em"
    },
    socialBar: {
        margin: 2 * theme.spacing.unit
    },
    copyrightText: {
        fontSize: "0.8em"
    },
    socialIcon: {
        height: "3rem",
        width: "3rem"
    }
});

class Footer extends React.Component {

    constructor() {
        super();
    }

    render() {
        const classes = this.props.classes;
        return (
            <div className={classes.root}>

                <AppBar elevation={0} position="static" className={classes.containerBar}>
                    <Toolbar className={classes.bar}>

                        <AdvancedLink to="/my-pepes"
                                          className={classes.headerButton}>My Pepes</AdvancedLink>




                        <AdvancedLink to="/marketplace">Marketplace</AdvancedLink>
                        <AdvancedLink to="/explorer">Explorer</AdvancedLink>
                        <Hidden smDown>
                            <AdvancedLink to="/faq">FAQ</AdvancedLink>
                            <AdvancedLink to="/about">About us</AdvancedLink>
                        </Hidden>
                    </Toolbar>
                    <Hidden mdUp>
                        <Toolbar className={classes.bar}>
                            <AdvancedLink to="/faq">FAQ</AdvancedLink>
                            <AdvancedLink to="/about">About us</AdvancedLink>
                        </Toolbar>
                    </Hidden>

                    <Toolbar className={classNames(classes.bar, classes.socialBar)}>
                        <AdvancedLink external to="https://twitter.com/cryptopepes"><Twitter className={classes.socialIcon}/></AdvancedLink>
                        <AdvancedLink external to="https://reddit.com/r/cryptopepe"><Reddit className={classes.socialIcon}/></AdvancedLink>
                        <AdvancedLink external to="https://t.me/cryptopepes"><Telegram className={classes.socialIcon}/></AdvancedLink>
                        <AdvancedLink external to="https://www.facebook.com/cryptopepes/"><Facebook className={classes.socialIcon}/></AdvancedLink>
                        <AdvancedLink external to="https://www.instagram.com/cryptopepes/"><Instagram className={classes.socialIcon}/></AdvancedLink>
                    </Toolbar>

                    <Toolbar className={classes.bar}>

                        {/*<AdvancedLink to="/terms" variant="caption">Terms of use</AdvancedLink>*/}
                        {/*<AdvancedLink to="/privacy" variant="caption">Privacy policy</AdvancedLink>*/}

                        <Hidden smDown>
                            <AdvancedLink variant="caption">|</AdvancedLink>

                            <AdvancedLink to="/" className={classes.copyrightText} variant="caption">Copyright &copy; 2018 CryptoPepes.io</AdvancedLink>
                        </Hidden>
                    </Toolbar>

                    <Hidden mdUp>
                        <Toolbar className={classes.bar}>
                            <AdvancedLink to="/" className={classes.copyrightText} variant="caption">Copyright &copy; 2018 CryptoPepes.io</AdvancedLink>
                        </Toolbar>
                    </Hidden>

                </AppBar>

            </div>
        );
    }
}


export default withStyles(styles)(Footer);
