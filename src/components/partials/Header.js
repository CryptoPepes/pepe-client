import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from "@material-ui/core/styles";
import {
    AppBar, Toolbar, Typography, IconButton, Tooltip, Hidden,
    Popover, List, ListItem, ListItemIcon, ListItemText, Divider
} from "@material-ui/core";
import AppStyle from "../../style.scss";
import themeActionTypes from "../../reducers/theme/themeActionTypes";
import walletActionTypes from "../../reducers/wallet/walletActionTypes";
import breederActionTypes from "../../reducers/breeder/breederActionTypes";
import {
    // FormatTextdirectionLToR, FormatTextdirectionRToL,
    AccountBalanceWallet, Menu, ViewList, Store, HelpOutline, InfoOutlined,
    QuestionAnswer
} from "@material-ui/icons";
import { LightbulbOnOutline, LightbulbOutline } from 'mdi-material-ui';
import {Link} from "react-router-dom";
import AdvancedLink from "../elements/util/AdvancedLink";
import {TagHeart} from "mdi-material-ui";


const styles = theme => ({
    root: {
        width: '100%',
        position: "relative",
        zIndex: 1050
    },
    grow: {
        flex: '1 1 auto',
    },
    appBar: {
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.background.default,
        paddingLeft: 20,
        paddingRight: 20
    },
    headerButton: {
        color: "#fff",
    },
    menuButton: {
        margin: "0 10px"
    },
    avatar: {
        height: 40,
        marginRight: theme.spacing.unit * 2
    }
});

class Header extends React.Component {

    constructor() {
        super();
        this.state = {
            mainMenuOpen: false,
            mainMenuAnchorEl: null,
            helpMenuOpen: false,
            helpMenuAnchorEl: null,
        }
    }

    menuButton = null;
    helpButton = null;


    handleMainMenuButtonClick = () => {
        this.setState({
            mainMenuOpen: true,
            mainMenuAnchorEl: findDOMNode(this.menuButton),
        });
    };

    handleHelpMenuButtonClick = () => {
        this.setState({
            helpMenuOpen: true,
            helpMenuAnchorEl: findDOMNode(this.helpButton),
        });
    };

    handleMenuClose = () => {
        this.setState({
            mainMenuOpen: false,
        });
    };

    handleHelpClose = () => {
        this.setState({
            helpMenuOpen: false,
        });
    };


    handleTogglePaletteType = () => {
        this.props.dispatch({
            type: themeActionTypes.THEME_CHANGE_PALETTE_TYPE,
            payload: {
                paletteType: this.props.uiTheme.paletteType === 'light' ? 'dark' : 'light',
            },
        });
    };

    handleToggleDirection = () => {
        this.props.dispatch({
            type: themeActionTypes.THEME_CHANGE_DIRECTION,
            payload: {
                direction: this.props.uiTheme.direction === 'ltr' ? 'rtl' : 'ltr',
            },
        });
    };
    handleBreederToggle = () => {
        this.props.dispatch({
            type: breederActionTypes.BREEDER_TOGGLE_DRAWER
        });
    };

    handleWalletToggle = () => {
        this.props.dispatch({
            type: walletActionTypes.WALLET_TOGGLE_DRAWER
        });
    };


    render() {
        const { classes, uiTheme, wallet } = this.props;

        const walletBtnText = wallet.openDrawer ? "Close wallet" : "Show wallet";
        const breederBtnText = wallet.openDrawer ? "Close cozy time plans" : "Show cozy time plans";

        return (
            <div className={classes.root}>
                <AppBar position="static" className={classes.appBar} elevation={0}>
                    <Toolbar>
                        <Hidden smDown>
                            <Link className={AppStyle.noDeco} to="/">
                                <img alt="[CryptoPepes]" src="/img/brand.svg" className={classes.avatar}/>
                            </Link>
                        </Hidden>
                        <div>
                            <Typography variant="title" color="inherit">
                                <Link className={AppStyle.noDeco} to="/">
                                    CryptoPepes.io
                                </Link>
                            </Typography>
                        </div>


                        <div className={classes.grow} />

                        <Hidden xsDown>
                            <AdvancedLink to="/my-pepes"
                                          className={classes.headerButton}>My Pepes</AdvancedLink>
                            <AdvancedLink to="/marketplace"
                                          className={classes.headerButton}>MarketPlace</AdvancedLink>

                            <div className={classes.grow} />
                        </Hidden>

                        <Hidden smDown>


                            <Tooltip id="appbar-help" title="Show help" enterDelay={300}>
                                <IconButton
                                    ref={node => {
                                        this.helpButton = node;
                                    }}
                                    className={classes.headerButton}
                                    onClick={this.handleHelpMenuButtonClick}
                                    aria-labelledby="appbar-help">
                                    <HelpOutline />
                                </IconButton>
                            </Tooltip>

                            <Popover
                                open={this.state.helpMenuOpen}
                                anchorEl={this.state.helpMenuAnchorEl}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: uiTheme.direction === 'rtl' ? "left" : "right",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: uiTheme.direction === 'rtl' ? "left" : "right",
                                }}
                                onClose={this.handleHelpClose}
                            >
                                <List component="nav">
                                    <Link to='/about' className={AppStyle.noDeco}>
                                        <ListItem button>
                                            <ListItemIcon>
                                                <InfoOutlined />
                                            </ListItemIcon>
                                            <ListItemText primary="About us" />
                                        </ListItem>
                                    </Link>
                                    <Link to='/faq' className={AppStyle.noDeco}>
                                        <ListItem button>
                                            <ListItemIcon>
                                                <QuestionAnswer />
                                            </ListItemIcon>
                                            <ListItemText primary="FAQ" />
                                        </ListItem>
                                    </Link>
                                    <Link to='/tutorial' className={AppStyle.noDeco}>
                                        <ListItem button>
                                            <ListItemIcon>
                                                <HelpOutline />
                                            </ListItemIcon>
                                            <ListItemText primary="Tutorial" />
                                        </ListItem>
                                    </Link>
                                </List>
                            </Popover>

                            <Tooltip id="appbar-theme" title={walletBtnText} enterDelay={300}>
                                <IconButton
                                    className={classes.headerButton}
                                    onClick={this.handleWalletToggle}
                                    aria-labelledby="appbar-theme">
                                    <AccountBalanceWallet />
                                </IconButton>
                            </Tooltip>

                            <Tooltip id="appbar-theme" title={breederBtnText} enterDelay={300}>
                                <IconButton
                                    className={classes.headerButton}
                                    onClick={this.handleBreederToggle}
                                    aria-labelledby="appbar-theme">
                                    <TagHeart />
                                </IconButton>
                            </Tooltip>

                            <Tooltip id="appbar-theme" title="Toggle light/dark theme" enterDelay={300}>
                                <IconButton
                                    className={classes.headerButton}
                                    onClick={this.handleTogglePaletteType}
                                    aria-labelledby="appbar-theme">
                                    { uiTheme.paletteType === 'light'
                                        ? <LightbulbOnOutline />
                                        : <LightbulbOutline />
                                    }

                                </IconButton>
                            </Tooltip>

                            {/*<Tooltip*/}
                                {/*id="appbar-direction"*/}
                                {/*title="Toggle main menu"*/}
                                {/*enterDelay={300}>*/}
                                {/*<IconButton*/}
                                    {/*className={classes.headerButton}*/}
                                    {/*onClick={this.handleToggleDirection}*/}
                                    {/*aria-labelledby="appbar-direction">*/}
                                    {/*{uiTheme.direction === 'rtl' ? (*/}
                                        {/*<FormatTextdirectionLToR />*/}
                                    {/*) : (*/}
                                        {/*<FormatTextdirectionRToL />*/}
                                    {/*)}*/}
                                {/*</IconButton>*/}
                            {/*</Tooltip>*/}
                        </Hidden>
                        <Hidden mdUp>

                            <Tooltip id="appbar-menu" title="Show menu" enterDelay={300}>
                                <IconButton

                                    ref={node => {
                                        this.menuButton = node;
                                    }}
                                    className={classes.headerButton}
                                    onClick={this.handleMainMenuButtonClick}
                                    aria-labelledby="appbar-menu">
                                    <Menu />
                                </IconButton>
                            </Tooltip>

                            <Popover
                                open={this.state.mainMenuOpen}
                                anchorEl={this.state.mainMenuAnchorEl}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: uiTheme.direction === 'rtl' ? "left" : "right",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: uiTheme.direction === 'rtl' ? "left" : "right",
                                }}
                                onClose={this.handleMenuClose}
                            >
                                <List component="nav">
                                    <Hidden smUp>
                                        <Link to='/marketplace' className={AppStyle.noDeco}>
                                            <ListItem button>
                                                <ListItemIcon>
                                                    <Store />
                                                </ListItemIcon>
                                                <ListItemText primary="Marketplace" />
                                            </ListItem>
                                        </Link>
                                        <Link to='/my-pepes' className={AppStyle.noDeco}>
                                            <ListItem button>
                                                <ListItemIcon>
                                                    <ViewList />
                                                </ListItemIcon>
                                                <ListItemText primary="My Pepes" />
                                            </ListItem>
                                        </Link>
                                        <Divider />
                                    </Hidden>

                                    <Link to='/about' className={AppStyle.noDeco}>
                                        <ListItem button>
                                            <ListItemIcon>
                                                <InfoOutlined />
                                            </ListItemIcon>
                                            <ListItemText primary="About us" />
                                        </ListItem>
                                    </Link>
                                    <Link to='/faq' className={AppStyle.noDeco}>
                                        <ListItem button>
                                            <ListItemIcon>
                                                <QuestionAnswer />
                                            </ListItemIcon>
                                            <ListItemText primary="FAQ" />
                                        </ListItem>
                                    </Link>
                                    <Link to='/tutorial' className={AppStyle.noDeco}>
                                        <ListItem button>
                                            <ListItemIcon>
                                                <HelpOutline />
                                            </ListItemIcon>
                                            <ListItemText primary="Tutorial" />
                                        </ListItem>
                                    </Link>

                                    <Divider />

                                    <ListItem button
                                              onClick={this.handleWalletToggle}>
                                        <ListItemIcon>
                                            <AccountBalanceWallet />
                                        </ListItemIcon>
                                        <ListItemText primary={walletBtnText} />
                                    </ListItem>
                                    <ListItem button
                                              onClick={this.handleBreederToggle}>
                                        <ListItemIcon>
                                            <TagHeart />
                                        </ListItemIcon>
                                        <ListItemText primary={breederBtnText} />
                                    </ListItem>

                                    <Divider />


                                    <ListItem button
                                              onClick={this.handleTogglePaletteType}>
                                        <ListItemIcon>
                                            { uiTheme.paletteType === 'light'
                                                ? <LightbulbOnOutline />
                                                : <LightbulbOutline />
                                            }
                                        </ListItemIcon>
                                        <ListItemText primary="Toggle light/dark theme" />
                                    </ListItem>


                                    {/*<ListItem button*/}
                                              {/*onClick={this.handleToggleDirection}>*/}
                                        {/*<ListItemIcon>*/}
                                            {/*{uiTheme.direction === 'rtl' ? (*/}
                                                {/*<FormatTextdirectionLToR />*/}
                                            {/*) : (*/}
                                                {/*<FormatTextdirectionRToL />*/}
                                            {/*)}*/}
                                        {/*</ListItemIcon>*/}
                                        {/*<ListItemText primary="Toggle read direction" />*/}
                                    {/*</ListItem>*/}


                                </List>
                            </Popover>
                        </Hidden>

                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}


Header.propTypes = {
    dispatch: PropTypes.func.isRequired,
    uiTheme: PropTypes.object.isRequired
};

const styledHeader = withStyles(styles)(Header);

export default connect(state => ({
    uiTheme: state.theme,
    wallet: state.wallet,
    breeder: state.breeder
}))(styledHeader);
