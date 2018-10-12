import {Switch, Route, /*withRouter*/} from 'react-router-dom'
import PepePage from "../screens/PepePage";
import React from "react";
import Portfolio from "../screens/Portfolio";
import Home from "../screens/Home";
import Market from "../screens/Market";
import FaqPage from "../screens/FaqPage";
import About from "../screens/About";
import Tutorial from "../screens/Tutorial";
import NoWeb3 from "../screens/NoWeb3";
import NoAccount from "../screens/NoAccount";
import ScrollToTop from "../elements/util/ScrollToTop";
import Web3StatusRedirector from "../screens/Web3StatusRedirector";
import WrongNet from "../screens/WrongNet";

const MainContent = () => {

    return (
        <main>
            <ScrollToTop/>
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route exact strict={false} path='/pepe/:pepeId' render={({match, ...remainingProps}) => {
                    const pepeId = match.params["pepeId"];
                    console.log("Loading pepe page for: "+pepeId);
                    return (<PepePage pepeId={pepeId} {...remainingProps}/>)
                }}/>
                <Route exact strict={false} path='/my-pepes'>
                    {/* default settings redirect to portfolio of user in case everything is OK. */}
                    <Web3StatusRedirector/>
                </Route>
                <Route exact strict={false} path='/portfolio/:portfolioAddress' render={({match, ...remainingProps}) => {
                    const portfolioAddress = match.params["portfolioAddress"];
                    console.log("Loading portfolio for: "+portfolioAddress);
                    return (<Portfolio portfolioAddress={portfolioAddress} {...remainingProps}/>)
                }}/>
                <Route exact strict={false} path='/marketplace' component={Market}/>
                <Route exact strict={false} path='/faq' component={FaqPage}/>
                <Route exact strict={false} path='/about' component={About}/>
                <Route exact strict={false} path='/tutorial' component={Tutorial}/>
                <Route exact strict={false} path='/no-web3' component={NoWeb3}/>
                <Route exact strict={false} path='/no-account' component={NoAccount}/>
                <Route exact strict={false} path='/wrong-net' component={WrongNet}/>
            </Switch>
        </main>
    );
};

export default MainContent;//withRouter(MainContent);
