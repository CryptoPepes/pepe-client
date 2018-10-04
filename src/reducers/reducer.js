import {combineReducers} from 'redux'
import redappReducer from 'redapp/es/reducer';

import themeReducer from "./theme/themeReducer";
import walletReducer from "./wallet/walletReducer";
import breederReducer from "./breeder/breederReducer";

const reducer = combineReducers({
    theme: themeReducer,
    wallet: walletReducer,
    breeder: breederReducer,
    redapp: redappReducer
});

export default reducer;
