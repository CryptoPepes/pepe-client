import React from "react";
import {Grid, Typography, Button} from "@material-ui/core";
import {Link} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import MarketPreview from "../elements/home/MarketPreview";
import RoundedStyle from "../styles/rounded.scss";
import BigQuotes from "../styles/BigQuotes.scss";
import classNames from 'classnames/bind';
import {Query} from "../../api/query_helper";
import WhatIsSection from "../elements/home/WhatIsSection";
import BreedingSection from "../elements/home/BreedingSection";
import CollectingSection from "../elements/home/CollectingSection";
import BattlingSection from "../elements/home/BattlingSection";
import MiningSection from "../elements/home/MiningSection";
import SeenOnSection from "../elements/home/SeenOnSection";
import AdvancedLink from "../elements/util/AdvancedLink";

const styles = theme => ({
    root: {
        flex: '1 0 100%',
        overflow: "hidden",
    },
    hero: {
        minHeight: '55vh',
        flex: '0 0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.background.default,
        color: theme.palette.primary.contrastText,
    },
    heroButton: {
        margin: theme.spacing.unit
    },
    topSectionHalf: {
        padding: 2 * theme.spacing.unit,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingTop: theme.spacing.unit * 8,
        paddingBottom: theme.spacing.unit * 8,
        [theme.breakpoints.up('sm')]: {
            paddingTop: theme.spacing.unit * 12,
            paddingBottom: theme.spacing.unit * 10,
        },

    },
    topSection: {
        minHeight: "600px",
        justify: "center"
    },
    heroTitleContainer: {
        position: "relative",
        padding: 80,
        marginLeft: -80,
        marginRight: -80
    },
    heroTitle: {
        fontWeight: 500,
        fontStyle: "italic",
        color: "white",
        [theme.breakpoints.down('xs')]: {
            fontSize: "3.5rem",
            lineHeight: "3.6rem",
            width: 300,
        },
        [theme.breakpoints.only('sm')]: {
            fontSize: "4.0rem",
            lineHeight: "4.1rem",
            width: 350,
        },
        [theme.breakpoints.only('md')]: {
            fontSize: "4.5rem",
            lineHeight: "4.5rem",
            width: 400,
        },
        [theme.breakpoints.up('lg')]: {
            fontSize: "5.3rem",
            lineHeight: "5.3rem",
            width: 450,
        },
        display: "inline-block"
    },
    heroSubtitle: {
        marginBottom: "2rem",
        color: "white",
        [theme.breakpoints.down('xs')]: {
            fontSize: "1rem",
            width: 300,
        },
        [theme.breakpoints.only('sm')]: {
            fontSize: "1.3rem",
            width: 350,
        },
        [theme.breakpoints.only('md')]: {
            fontSize: "1.6rem",
            width: 400,
        },
        [theme.breakpoints.up('lg')]: {
            fontSize: "1.9rem",
            width: 450,
        },
    },
    afterRounded: {
        marginTop: -100,
        paddingTop: 200,
    },
    beforeRounded: {
        marginBottom: -100,
        paddingBottom: 200,
    },
    ethPattern: {
        background: theme.palette.type === 'light' ? "url(\"/img/patterns/eth-white.svg\")" : "url(\"/img/patterns/eth-black.svg\")",
        backgroundSize: 100,
        backgroundRepeat: "repeat",
        backgroundColor: theme.palette.type === 'light' ? "#f3f3f3" : "#222"
    },
    axePattern: {
        background: theme.palette.type === 'light' ? "url(\"/img/patterns/pickaxe-white.svg\")" : "url(\"/img/patterns/pickaxe-black.svg\")",
        backgroundSize: 100,
        backgroundRepeat: "repeat",
        backgroundColor: theme.palette.type === 'light' ? "#f3f3f3" : "#222"
    },
    whatIsSection: {

    },
    collectingSection: {
        backgroundColor: theme.palette.type === 'light' ? "#fff" : "#000",
    },
    breedingSection: {

    },
    battlingSection: {
        background: theme.palette.type === 'light' ? "#fff" : "#000",
        borderBottom: theme.palette.type === 'light' ? "1px solid #333" : "1px solid #ccc",
        paddingBottom: 1,
        marginBottom: 20
    },
    miningSection: {
        backgroundColor: theme.palette.type === 'light' ? "#f3f3f3" : "#222"
    },
    seenOnSection: {
        backgroundColor: theme.palette.type === 'light' ? "#e0e0e0" : "#313131",
    },
});

function Home(props) {
    const classes = props.classes;

    return (
        <div className={classes.root}>
            <div className={classNames(classes.hero, RoundedStyle.roundedDown)}>
                <div className={classes.content} style={{padding: "0px 20px"}}>
                    <Grid container spacing={0} justify="center"
                          className={classes.topSection}>
                        <Grid item sm={12} md={6} className={classes.topSectionHalf}>
                            <div>
                                <div className={classes.heroTitleContainer}>
                                        <div className={BigQuotes.openQuote}/>
                                    <Typography component="h1" className={classes.heroTitle}
                                                variant="display3">
                                        COLLECT<br/>
                                        HOP' KEK<br/>
                                        BATTLE
                                    </Typography>
                                        <div className={BigQuotes.closeQuote}/>
                                </div>
                                <Typography component="h2" className={classes.heroSubtitle}
                                            variant="subheading">
                                    Breed, Collect, Fight
                                    and Trade <strong>CryptoPepes</strong>
                                </Typography>

                                <Button component={AdvancedLink} to="https://t.me/cryptopepes"
                                        external newTab disableLinkPadding
                                        variant="raised" color="secondary" size="large" style={{color: 'white'}}
                                        className={classes.heroButton}>
                                    Join Telegram
                                </Button>

                                <Button component={AdvancedLink} to="https://airdrop.cryptopepes.io/"
                                        external newTab disableLinkPadding
                                        variant="raised" color="secondary" size="large" style={{color: 'white'}}
                                        className={classes.heroButton}>
                                    Airdrop
                                </Button>
                            </div>
                        </Grid>

                        <Grid item sm={12} md={6} className={classes.topSectionHalf}>
                            <MarketPreview queryStr={
                                Query.buildQuery({sort: "newest-first", gen: 1, limit: 4}).toURLParamStr()
                            }/>
                        </Grid>
                    </Grid>
                </div>
            </div>

            <div className={classNames(classes.whatIsSection, classes.afterRounded, classes.ethPattern)}>
                <WhatIsSection/>
            </div>

            <div className={classes.collectingSection}>
                <CollectingSection/>
            </div>

            <div className={classNames(classes.breedingSection, classes.ethPattern, classes.beforeRounded)}>
                <BreedingSection/>
            </div>

            <div className={classNames(classes.battlingSection, RoundedStyle.roundedUp)}>
                <BattlingSection/>
            </div>

            <div className={classNames(classes.miningSection, classes.axePattern, RoundedStyle.roundedDown)}>

                <Grid container spacing={40}  justify="center">
                    <Grid  item xs={12} sm={10} md={8}>
                        <MiningSection/>
                    </Grid>
                </Grid>
            </div>

            <div className={classNames(classes.seenOnSection, classes.afterRounded)}>
                <SeenOnSection/>
            </div>

        </div>
    );
}

export default withStyles(styles)(Home);
