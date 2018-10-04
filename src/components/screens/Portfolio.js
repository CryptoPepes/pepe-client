import React, { Component } from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import Explorer from "../elements/explorer/Explorer";
import { connect } from 'react-redux';
import {Query} from "../../api/query_helper";
import {ViewList} from "@material-ui/icons";
import {hasAccount, isValidAccountAddress} from "../../util/web3AccountsUtil";
import {Typography} from "@material-ui/core";
import EthAccount from "../elements/util/EthAccount";

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        backgroundColor: theme.palette.background.paper,
    },
    top: {
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
    },
    topIcon: {
        width: "3rem",
        height: "3rem",
        margin: theme.spacing.unit * 2,
        verticalAlign: "middle"
    },
    topTitle: {
        ...theme.typography.display3,
        fontSize: "3rem",
        verticalAlign: "middle",
        display: "inline-block"
    }
});

class Portfolio extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const { classes, portfolioAddress, wallet } = this.props;
        let presetQuery = undefined;
        const isValidAddress = isValidAccountAddress(portfolioAddress);

        if (!isValidAddress) {
            return (
                <div className={classes.root}>
                    <Typography variant="title">Portfolio address is invalid!</Typography>
                </div>
            );
        }

        if (!this.props.location.search) {
            presetQuery = Query.buildQuery({ owner: portfolioAddress });
        } else {
            presetQuery = Query.queryStringToQuery(this.props.location.search);
            presetQuery.changeOwner(portfolioAddress);
        }

        const isUserAddress = hasAccount(wallet, portfolioAddress);

        const top = (
            <div className={classes.top}>
                <h1 className={classes.topTitle}>
                    <ViewList className={classes.topIcon} /> {isUserAddress ? <span>My Pepes</span> : <span>Portfolio</span>}
                </h1>
                <EthAccount address={portfolioAddress}/>
            </div>
        );

        return (
            <div className={classes.root}>

                <Explorer topContent={top} filter={presetQuery} perPage={15}/>

            </div>
        );
    }

}

Portfolio.propTypes = {
    classes: PropTypes.object.isRequired,
    portfolioAddress: PropTypes.string.isRequired
};

const styledPortfolio = withStyles(styles)(Portfolio);

export default connect(state => ({
    wallet: state.redapp.tracking.accounts.wallet
}))(styledPortfolio);
