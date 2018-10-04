import React from "react";
import MainContent from "./partials/MainContent";
import { withStyles } from "@material-ui/core/styles";
import Header from "./partials/Header";
import Wallet from "./partials/Wallet";
import Footer from "./partials/Footer";
import Breeder from "./partials/Breeder";

const styles = theme => ({
    appWrapper: {
        minHeight: "100%",
        width: "100%",
        position: "absolute",
        backgroundColor: theme.palette.background.paper
    }
});

class CryptoPepeApp extends React.Component {


    render() {
        const { classes } = this.props;
        return (
            <div className={classes.appWrapper}>
                <Header/>
                <MainContent/>
                <Wallet/>
                <Footer/>
                <Breeder/>
            </div>
        );
    }


}

export default withStyles(styles)(CryptoPepeApp);

