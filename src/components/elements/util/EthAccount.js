import React from "react";
import {Button, Modal, Paper, Typography} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Blockies from "ethereum-blockies";
import classNames from 'classnames/bind';
import {withLoading} from "../../utils/WithFetching";
import PepeAPI from "../../../api/api";
import {connect} from "react-redux";
import Web3Utils from "web3-utils";
import AdvancedLink from "./AdvancedLink";
import EtherscanBtn from "./EtherscanBtn";

const styles = (theme) => ({
    accountImage: {
        display: "inline-block",
        verticalAlign: "middle",
        backgroundColor: theme.palette.type === "light" ? "#c0f9b9" : "#1d4b1b",
        backgroundSize: "contain"
    },
    containerSmallSize: {
        maxWidth: 320
    },
    containerNormalSize: {
        maxWidth: 380
    },
    accountImageNormalSize: {
        margin: theme.spacing.unit,
        height: 45,
        width: 45,
    },
    accountImageSmallSize: {
        margin: theme.spacing.unit * 0.5,
        height: 30,
        width: 30,
    },
    accountData: {
        display: "inline-block",
        verticalAlign: "middle",
        maxWidth: "70%"
    },
    accountNameWrapper: {
        padding: "8px 8px 0 8px"
    },
    accountDataNormalSize: {
        margin: theme.spacing.unit,
    },
    accountDataSmallSize: {
        margin: theme.spacing.unit * 0.5,
    },
    addressTextBtn: {
        width: "100%",
        padding: 0
    },
    addressText: {
        width: "100%",
        display: "block",
        ...theme.typography.caption,
        // Keep casing, the code transforms it to match EIP-55 casing.
        textTransform: "none",
        fontFamily: "monospace",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        padding: theme.spacing.unit * 0.5
    },
    addressModal: {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        position: 'absolute',
        width: theme.spacing.unit * 50,
        padding: theme.spacing.unit * 4,
    },
    optionContainer: {
        padding: theme.spacing.unit * 2
    }
});

const AccountNamePlaceholder = () =>
    (<Typography variant="caption" component="i">Anon pepe trader (no username)</Typography>);

const ApiLoadedAccountNameInner = ({data, isLoading, error}) => {

    if (error) {
        // Error = non-existent name
        return <AccountNamePlaceholder/>
    } else {
        if (isLoading) {
            return <Typography variant="body2">Loading...</Typography>
        } else {
            return <Typography variant="body2">{!data ? "?" : data.username}</Typography>
        }
    }
};

// Default on API, web3 is not as fast, or as available.
const ApiLoadedAccountName = withLoading((props) => PepeAPI.getUserData(props.address))(ApiLoadedAccountNameInner);

class AccountName extends React.Component {


    constructor() {
        super();

        this.state = {
            open: false,
            web3usernameKey: undefined,
            web3usernameAddr: undefined
        }
    }

    componentWillReceiveProps(nextProps) {

        const {address, hasWeb3, PepeBase} = nextProps;

        if (!hasWeb3 || !hasWeb3 || !PepeBase) {
            return
        }

        // Track the address in lowercase format, to prevent reloads when source formatting changes.
        const nextAddress = (!address ? undefined : address.toLowerCase());
        // Only load it if necessary
        if (nextAddress !== this.state.web3usernameAddr) {

            if (!nextAddress) {
                console.log("nextAddress: ", nextAddress);
                console.log("web3 address: ", this.state.web3usernameAddr);
                this.setState({
                    web3usernameCallId: undefined, web3usernameAddr: nextAddress
                });
            } else {

                console.log("Checking username!");
                const web3usernameCallId = (!!address) ? PepeBase.methods.addressToUser.cacheCall({}, address) : undefined;

                this.setState({
                    web3usernameCallId, web3usernameAddr: nextAddress
                });
            }

        }
    }

    render() {
        const {hasWeb3, calls, address} = this.props;

        const usernameCache = (this.state.web3usernameCallId !== undefined && hasWeb3)
            ? calls[this.state.web3usernameCallId] : undefined;

        if (!!usernameCache && usernameCache.hasOwnProperty("value")) {
            const web3username = Web3Utils.hexToUtf8(usernameCache.value);
            return (<span>
                <Typography variant="body2">{web3username}</Typography>
                <Typography variant="caption">(Web3 verified)</Typography>
            </span>)
        } else {
            // No web3 username available? Then use the backend.
            return <ApiLoadedAccountName key={address} address={address}/>
        }
    }
}

const Web3LoadedAccountName = connect(state => ({
    hasWeb3: state.hasWeb3,
    PepeBase: state.redapp.contracts.PepeBase,
    calls: state.redapp.tracking.calls
}))(AccountName);

Web3LoadedAccountName.propTypes = {
    // Not required, if undefined -> no account name will be shown; default "no name" text instead.
    address: PropTypes.string
};


class EthAccount extends React.Component {

    constructor() {
        super();

        this.state = {
            open: false,
            imgData: undefined,
            imgAddr: undefined
        }
    }

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };


    // This method is static, rather odd, but following the official react docs.
    static getDerivedStateFromProps(nextProps, prevState) {

        // Track the address in lowercase format, to prevent reloads when source formatting changes.
        const nextAddress = (!nextProps.address ? undefined : nextProps.address.toLowerCase());
        if (nextAddress !== prevState.imgAddr) {

            if (!nextProps.address) {
                return { imgData: undefined, imgAddr: undefined };
            } else {
                // Only create canvas when necessary (on address prop change)
                const imgData = Blockies.create({
                    seed: nextAddress,
                    size: 15, scale: 3
                }).toDataURL();

                return {imgData, imgAddr: nextAddress};
            }

        } else {
            return null;
        }
    }

    render() {
        const {address, classes, children, small } = this.props;
        const {open, imgData} = this.state;

        const profilePicStyle = !!address && !!imgData ?
            {backgroundImage: 'url(' + imgData +')'}
            : {};

        // Nicely format it using eip55, for usability purposes.
        const formattedAddress = !address ? undefined :
            <span className={classes.addressText}>{Web3Utils.toChecksumAddress(address)}</span>;

        return (
            <div className={small ? classes.containerSmallSize : classes.containerNormalSize}>
                <div className={classNames(
                    classes.accountImage,
                    small ? classes.accountImageSmallSize : classes.accountImageNormalSize)
                } style={profilePicStyle}>

                </div>
                <div className={classNames(classes.accountData,
                        small ? classes.accountDataSmallSize : classes.accountDataNormalSize)}>

                    <div className={classes.accountNameWrapper}>
                        <Web3LoadedAccountName address={address}/>
                    </div>

                    <Modal
                        aria-labelledby="address-modal-title"
                        aria-describedby="address-modal-description"
                        open={open}
                        onClose={this.handleClose}
                    >
                        <Paper className={classes.addressModal}>
                            <Typography variant="title" id="address-modal-title">
                                Address: <span
                                className={classes.addressText}>{formattedAddress || "?"}</span>
                            </Typography>
                            {address && (
                                <div className={classes.optionContainer}>
                                <EtherscanBtn link={"/address/" + address} size="medium">View account on Etherscan</EtherscanBtn>
                                </div>)
                            }
                            {address && (
                                <div className={classes.optionContainer}>
                                    <AdvancedLink to={"/portfolio/" + address}
                                                    disableLinkPadding>
                                        <Button color="primary" variant="raised" size="medium">
                                            Show pepe portfolio
                                        </Button>
                                    </AdvancedLink>
                                </div>
                                )
                            }
                        </Paper>
                    </Modal>
                    <Button onClick={this.handleOpen}
                            className={classes.addressTextBtn}>{formattedAddress || "?"}</Button>
                    {children && <br/>}
                    {children}
                </div>
            </div>
        );
    }
}

EthAccount.defaultProps = {
    small: false
};

EthAccount.propTypes = {
    address: PropTypes.string,
    small: PropTypes.bool
};

export default withStyles(styles)(EthAccount);
