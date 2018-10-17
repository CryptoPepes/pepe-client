import React from "react";
import {Card, CardContent, CardActions, Typography, Button, Grid} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {TagHeart} from "mdi-material-ui";
import PropTypes from "prop-types";
import QueryTextual from "../../../api/query_textual";
import Separator from "../util/Separator";
import EthAccount from "../util/EthAccount";
import PepePicture from "./PepePicture";
import {findDOMNode} from "react-dom";
import Moment from 'react-moment';
import BreederAddMenu from "../actions/breeder/BreederAddMenu";
import {hasAccount} from "../../../util/web3AccountsUtil";
import {connect} from "react-redux";
import {saleAddr, cozyAddr} from "../../../web3Settings";

const styles = (theme) => ({
    root: {
        padding: theme.spacing.unit * 2
    },
    pepeName: {
        wordWrap: "break-word"
    },
    pepeMetaData: {
        ...theme.typography.subheading,
        color: theme.palette.type === 'light' ? "#7a7a7a" : "#939393",
        paddingTop: theme.spacing.unit * 2
    }
});

class PepeSummary extends React.Component {

    render() {
        const {pepeData, pepeId, classes} = this.props;

        const pepe = pepeData.pepe;
        const isLoading = pepeData.status !== "ok";

        let nameEl;
        if (isLoading) {
            nameEl = (<span>Pepe ?</span>)
        } else if (pepe.name != null) {
            nameEl = (<strong>{pepe.name}</strong>)
        } else {
            nameEl = (<span>Pepe #{pepe.pepeId}<Typography variant="caption"
                                                           component="i">(Not named)</Typography></span>)
        }

        const time = Math.floor(Date.now() / 1000);

        const cozyWhenEl = (isLoading || !pepe || pepe.can_cozy_again === undefined)
            ? <span>...</span>
            : (pepe.can_cozy_again === 0
                ? (<span>Never hopped</span>)
                : (<span>{
                        pepe.can_cozy_again < time
                            ? "Ready to hop, "
                            : "Will be ready to hop "
                    } <Moment unix fromNow interval={0}>{pepe.can_cozy_again}</Moment>
                    </span>)
            );

        return (

            <Card className={classes.root}>
                <Grid container spacing={16}>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <CardContent>
                            <Typography variant="display2" className={classes.pepeName}>
                                {nameEl}
                            </Typography>

                            <Typography paragraph={true} className={classes.pepeMetaData}>
                                <span>Pepe #{pepeId}</span>
                                <Separator/>
                                <span>Gen {isLoading ? "..." : pepe.gen}</span>
                                <Separator/>
                                <span>Cooldown of {isLoading ? "..." : QueryTextual.getCooldownText(pepe.cool_down_index)}</span>
                                <Separator/>
                                {cozyWhenEl}
                            </Typography>

                            <EthAccount address={isLoading ? null : pepe.master}/>

                        </CardContent>
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <PepePicture pepeId={pepeId}/>
                    </Grid>
                </Grid>
            </Card>
        );
    }
}

const ConnectedPepeSummary = connect((state, props) => ({
    hasWeb3: state.web3.hasWeb3,
    wallet: state.redapp.tracking.accounts.wallet,
    pepeData: (state.pepe.pepes[props.pepeId] && (state.pepe.pepes[props.pepeId].web3 || state.pepe.pepes[props.pepeId].api)) || {}
}))(PepeSummary);

export default withStyles(styles)(ConnectedPepeSummary);
