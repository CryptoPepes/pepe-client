import web3AT from './web3AT';

const initialState = {
    status: 'DISCONNECTED',
    networkID: null
};

const mapping = {
    [web3AT.WEB3_CONNECT_STATUS]: (state, {status}) => ({
        ...state,
        status
    }),
    [web3AT.WEB3_NETID]: (state, {networkID}) => ({
        ...state,
        networkID
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
