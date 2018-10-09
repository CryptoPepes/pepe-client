import web3AT from './web3AT';
import { targetNetID } from "../../web3Settings";

const initialState = {
    status: 'DISCONNECTED',
    networkID: targetNetID,
    // Shorthand to determine whether or not to use Web3 actions in the application
    hasWeb3: false,
    netIDok: true
    // - The app will check if the networkID matches the target, and notify the user when they are on the wrong net.
    // - The app will check if Web3 is:
    //    - "CONNECTED" -> perfect!
    //    - "NO_WEB3"   -> User will need to install Metamask/other provider for web3 features
    // special case: connected, but not logged in. App will detect wallet without addresses.
};

const mapping = {
    [web3AT.WEB3_CONNECT_STATUS]: (state, {status}) => ({
        ...state,
        status,
        hasWeb3: status === "CONNECTED" && state.networkID === targetNetID
    }),
    [web3AT.WEB3_NETID]: (state, {networkID}) => ({
        ...state,
        networkID,
        hasWeb3: state.status === "CONNECTED" && networkID === targetNetID,
        netIDok: true
    }),
    [web3AT.WEB3_NETID_ERR]: (state) => ({
        ...state,
        networkID: 0,
        hasWeb3: false,
        netIDok: false
    })
};

function web3Red(state = initialState, action) {
    let newState = state;

    if (mapping[action.type]) {
        newState = mapping[action.type](state, action);
    }

    return newState;
}

export default web3Red;
