import React from "react";
import {Redirect} from "react-router-dom";
import {getDefaultAccount} from "../../util/web3AccountsUtil";
import connect from "react-redux/es/connect/connect";
import PropTypes from "prop-types";


/**
 * Redirector, redirects to the appropriate error/warning page for each web3 status.
 * Redirect destinations can be overruled using component properties.
 */
const Web3StatusRedirector = ({connectedWrongNet, hasWeb3, networkID, wallet, dstAddrOk, dstNoWeb3, dstNoAccount, dstWrongNet}) => {

    if (connectedWrongNet) {
        return dstWrongNet ? dstWrongNet(networkID) : <Redirect to='/wrong-net'/>;
    } else {
        if (hasWeb3) {
            const defaultPortfolioAddress = getDefaultAccount(wallet);

            // Redirect to portfolio when web3 is loaded & recognized.
            if (!!defaultPortfolioAddress) return dstAddrOk
                ? dstAddrOk(defaultPortfolioAddress)
                : <Redirect to={"/portfolio/" + defaultPortfolioAddress}/>;

            return dstNoAccount ? dstNoAccount() : <Redirect to='/no-account'/>;
        } else {
            return dstNoWeb3 ? dstNoWeb3() : <Redirect to='/no-web3'/>;
        }
    }
};

Web3StatusRedirector.propTypes = {
    dstAddrOk: PropTypes.any,
    dstNoWeb3: PropTypes.any,
    dstNoAccount: PropTypes.any,
    dstWrongNet: PropTypes.any,
};

// Connect to Web3 to load default portfolio account etc.
const connectedWeb3StatusRedirector = connect(state => ({
    hasWeb3: state.web3.hasWeb3,
    networkID: state.web3.networkID,
    connectedWrongNet: state.web3.connectedWrongNet,
    wallet: state.redapp.tracking.accounts.wallet
}))(Web3StatusRedirector);

export default connectedWeb3StatusRedirector;
