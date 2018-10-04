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
    },
    cozyBtnIcon: {
        marginLeft: theme.spacing.unit,
    }
});

class PepeSummary extends React.Component {

    constructor() {
        super();

        this.state = {
            breederMenuOpen: false,
            breederMenuAnchorEl: null,
        };
    }

    breederMenuButton = null;

    closeBreederMenu = () => {
        this.setState({
            breederMenuOpen: false
        });
    };

    handleBreederMenuOpen = () => {
        this.setState({
            breederMenuOpen: true,
            breederMenuAnchorEl: findDOMNode(this.breederMenuButton),
        });
    };

    render() {
        const {pepe, classes, hasWeb3, wallet, breeder} = this.props;

        const isLoading = pepe === undefined;

        let nameEl;
        if (isLoading) {
            nameEl = (<span>Pepe ?</span>)
        } else if (pepe.name !== null) {
            nameEl = (<strong>{pepe.name}</strong>)
        } else {
            nameEl = (<span>Pepe #{pepe.pepeId}<Typography variant="caption"
                                                           component="i">(Not named)</Typography></span>)
        }

        const pepePicture = isLoading ?
            (<PepePicture/>) : (<PepePicture pepeId={pepe.pepeId}/>);


        // Check if the pepe is being auctioned
        const isForCozy = !isLoading && pepe.cozy_auction !== undefined && !pepe.cozy_auction.isExpired();

        const isOwned = !isLoading && hasWeb3 && hasAccount(wallet, pepe.master);

        const isBreedable = isOwned || (hasWeb3 && isForCozy);

        const alreadySelectedMother = !!breeder.motherPepeId;
        const alreadySelectedFather = !!breeder.fatherPepeId;
        const alreadySelectedSelfAsMother = alreadySelectedMother && (breeder.motherPepeId === pepe.pepeId);
        const alreadySelectedSelftAsFather = alreadySelectedFather && (breeder.fatherPepeId === pepe.pepeId);
        const alreadySelectedSelf = alreadySelectedSelfAsMother || alreadySelectedSelftAsFather;

        const time = Math.floor(Date.now() / 1000);

        const owner = pepe.cozy_auction !== undefined
            ? (pepe.cozy_auction.seller)
            : (pepe.sale_auction !== undefined
                ? pepe.sale_auction.seller
                : pepe.master);

        const cozyWhenEl = pepe.can_cozy_again === undefined
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

                            {!isLoading && (
                                <Typography paragraph={true} className={classes.pepeMetaData}>
                                    <span>Pepe #{pepe.pepeId}</span>
                                    <Separator/>
                                    <span>Gen {pepe.gen}</span>
                                    <Separator/>
                                    <span>Cooldown of {QueryTextual.getCooldownText(pepe.cool_down_index)}</span>
                                    <Separator/>
                                    {cozyWhenEl}
                                </Typography>
                            )}

                            {isLoading ? (
                                <EthAccount/>
                            ) : (
                                <EthAccount address={owner}/>
                            )}

                        </CardContent>
                        <CardActions>
                            { /* The user must be either the owner,
                                or have it must be an auction, with web3 on. */ }
                            { isBreedable &&
                            <Button aria-label="Cozy"
                                        onClick={this.handleBreederMenuOpen}
                                    variant={alreadySelectedSelf ? "outlined" : "raised"}
                                    color="secondary"
                                        ref={node => {
                                            this.breederMenuButton = node;
                                        }}>
                                {isOwned ? "Hop with other pepe" : "Buy cozy auction"} <TagHeart className={classes.cozyBtnIcon}/>
                            </Button>
                            }

                            { isBreedable &&
                            <BreederAddMenu open={this.state.breederMenuOpen}
                                            onClose={this.closeBreederMenu}
                                            anchorDomEl={this.state.breederMenuAnchorEl}
                                            pepe={pepe}/>
                            }
                        </CardActions>
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        {pepePicture}
                    </Grid>
                </Grid>
            </Card>
        );
    }
}

PepeSummary.propTypes = {
    // when pepe is undefined -> loading placeholder is shown
    pepe: PropTypes.shape({
        name: PropTypes.string,
        pepeId: PropTypes.string,
        gen: PropTypes.number,
        cool_down_index: PropTypes.number,
        master: PropTypes.string,
    })
};

const ConnectedPepeSummary = connect(state => ({
    breeder: state.breeder,
    hasWeb3: state.hasWeb3,
    wallet: state.redapp.tracking.accounts.wallet
}))(PepeSummary);

export default withStyles(styles)(ConnectedPepeSummary);
