import affiliateActionTypes from './affiliateActionTypes';

const initialState = {
    affiliate: false,
};

const mapping = {
    [affiliateActionTypes.AFFILIATE_SET_AFFILIATE]: (state, action) => ({
        ...state,
        affiliate: action.affiliate,
    })
};

function affiliateReducer(state = initialState, action) {
    let newState = state;

    if (mapping[action.type]) {
        newState = mapping[action.type](state, action);
    }

    return newState;
}

export default affiliateReducer;
