import walletActionTypes from './walletActionTypes';

const initialState = {
    openDrawer: false,
};

const mapping = {
    [walletActionTypes.WALLET_TOGGLE_DRAWER]: (state, action) => ({
        ...state,
        openDrawer: !state.openDrawer,
    })
};

function walletReducer(state = initialState, action) {
    let newState = state;

    if (mapping[action.type]) {
        newState = mapping[action.type](state, action);
    }

    return newState;
}

export default walletReducer;
