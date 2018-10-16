import "regenerator-runtime/runtime";
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { AppContainer as ReactHotLoader } from "react-hot-loader";
import {Provider} from "react-redux";
import "./style.scss";
import AppWrapper from "./components/AppWrapper";
import setAffiliate from "./util/affiliate";
import storeCreator from "./reducers/store";

import { PersistGate } from 'redux-persist/integration/react';

const {store, persistor} = storeCreator();

setAffiliate(store);

const render = Component => {
    ReactDOM.render(
        <ReactHotLoader>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Router>
                        <Component />
                    </Router>
                </PersistGate>
            </Provider>
        </ReactHotLoader>,
        document.getElementById('root'),
    );
};

render(AppWrapper);

if (module.hot) {
    module.hot.accept('./components/AppWrapper', () => { {
        const Next = require("./components/AppWrapper").default;
        render(Next)
    } })
}
