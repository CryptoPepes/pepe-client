import {combineReducers} from 'redux'
import redappReducer from 'redapp/es/reducer';

import themeReducer from "./theme/themeReducer";
import walletReducer from "./wallet/walletReducer";
import breederReducer from "./breeder/breederReducer";
import affiliateReducer from "./affiliate/affiliateReducer";
import web3Red from "./web3/web3Red";
import pepeRed from "./pepe/pepeRed";

const reducer = combineReducers({
    theme: themeReducer,
    wallet: walletReducer,
    breeder: breederReducer,
    redapp: redappReducer,
    affiliate: affiliateReducer,
    web3: web3Red,
    pepe: pepeRed
});

export default reducer;
