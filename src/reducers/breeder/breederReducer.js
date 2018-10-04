import breederActionTypes from './breederActionTypes';
import {persistReducer} from "redux-persist";
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const initialState = {
    openDrawer: false,
    motherPepeId: undefined,
    fatherPepeId: undefined
};

const mapping = {
    [breederActionTypes.BREEDER_TOGGLE_DRAWER]: (state, action) => ({
        ...state,
        openDrawer: !state.openDrawer,
    }),
    [breederActionTypes.BREEDER_CHANGE_MOTHER]: (state, action) => ({
        ...state,
        motherPepeId: action.pepeId,
    }),
    [breederActionTypes.BREEDER_CHANGE_FATHER]: (state, action) => ({
        ...state,
        fatherPepeId: action.pepeId,
    }),
    [breederActionTypes.BREEDER_SWAP_PEPES]: (state, action) => ({
        ...state,
        fatherPepeId: state.motherPepeId,
        motherPepeId: state.fatherPepeId
    })
};

function breederReducer(state = initialState, action) {
    let newState = state;

    if (mapping[action.type]) {
        newState = mapping[action.type](state, action);
    }

    return newState;
}

const persistConfig = {
    key: 'breeder',
    storage,
    whitelist: ["motherPepeId", "fatherPepeId"]
};

export default persistReducer(persistConfig, breederReducer);
