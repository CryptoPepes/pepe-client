import {Switch, Route, Redirect, withRouter} from 'react-router-dom'
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
import {connect} from "react-redux";
import {getDefaultAccount} from "../../util/web3AccountsUtil";
import ScrollToTop from "../elements/util/ScrollToTop";

const MainContent = ({hasWeb3, wallet}) => {

    const defaultPortfolioAddress = hasWeb3 ? getDefaultAccount(wallet) : null;

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
                    {!defaultPortfolioAddress ?
                        (hasWeb3 ? <Redirect to='/no-web3'/> : <Redirect to='/no-account'/>):
                        <Redirect to={"/portfolio/" + defaultPortfolioAddress}/>
                    }
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
            </Switch>
        </main>
    );
};

// Connect to Web3 to load default portfolio account etc.
const connectedMainContent = connect(state => ({
    hasWeb3: state.web3.hasWeb3,
    wallet: state.redapp.tracking.accounts.wallet,
}))(MainContent);

export default withRouter(connectedMainContent);
