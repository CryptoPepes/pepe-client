import React from "react";
import {withStyles} from "@material-ui/core/styles";
import {Button, Card, CardContent, Grid, Typography} from "@material-ui/core";
import PropTypes from "prop-types";
import {withLoading} from "../utils/WithFetching";
import PepeAPI from "../../api/api";
import PepeGridItemLoadable from "../elements/grid/PepeGridItemLoadable";
import SimplePepeGrid from "../elements/grid/SimplePepeGrid";
import PepeActions from "../elements/pepePage/PepeActions";
import {Query} from "../../api/query_helper";
import { connect } from 'react-redux';
import PepeAttributes from "../elements/pepePage/PepeAttributes";
import PepeAuctionInfo from "../elements/pepePage/PepeAuctionInfo";
import CozyChip from "../elements/status/CozyChip";
import SaleChip from "../elements/status/SaleChip";
import PepeSummary from "../elements/pepePage/PepeSummary";
import PepeAuctionChart from "../elements/pepePage/PepeAuctionChart";
import PepeBio from "../elements/pepePage/PepeBio";
import {hasAccount} from "../../util/web3AccountsUtil";
import reloadable from "../utils/reloadable";
import Loading from "../elements/util/Loading";


const styles = theme => ({
    root: {
        width: "100%",
        backgroundColor: theme.palette.type === "light" ? "#ddd" : "#000",
        position: "relative"
    },
    backgroundFill: {
        opacity: "0.25",
        position: "absolute",
        zIndex: 1,
        width: "100%",
        height: "100%",
        top: 0,
        left: 0
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
    },
    mainInfo: {
        position: "relative",
        zIndex: 10,
        paddingTop: theme.spacing.unit * 8,
        paddingBottom: theme.spacing.unit * 12,
        /* Center the section */
        marginLeft: "auto",
        marginRight: "auto",
        width: '100%',
        [theme.breakpoints.only('xs')]: {
            paddingLeft: 2 * theme.spacing.unit,
            paddingRight: 2 * theme.spacing.unit
        },
        [theme.breakpoints.only('sm')]: {
            paddingLeft: 4 * theme.spacing.unit,
            paddingRight: 4 * theme.spacing.unit
        },
        [theme.breakpoints.up('md')]: {
            paddingLeft: 6 * theme.spacing.unit,
            paddingRight: 6 * theme.spacing.unit
        },
        [theme.breakpoints.only('lg')]: {
            width: 840
        },
        [theme.breakpoints.only('xl')]: {
            width: 1000
        },
    },
    detailSection: {
        display: "flex",
        flexDirection: "column"
    },
    detailSectionCard: {
        flexGrow: 1
    },
    auctionChartCard: {
        display: "flex",
        flexDirection: "row",
        justifyItems: "center",
        height: "100%"
    },
    infoHeading: {
        ...theme.typography.headline,
        fontWeight: 400,
        marginTop: theme.spacing.unit * 4,
        marginBottom: theme.spacing.unit,
        color: theme.palette.type === "light" ? "#444" : "#ddd"
    },
    placeholderCard: {
        height: 250
    },
    parentsInfo: {
        display: "flex",
        [theme.breakpoints.only('xs')]: {
            flexDirection: "column"
        },
        [theme.breakpoints.up('sm')]: {
            flexDirection: "row"
        },
        padding: theme.spacing
    },
    parentsInfoItem: {
        margin: theme.spacing.unit
    },
    loadingError: {
        height: 800,
        padding: theme.spacing.unit * 16,
        textAlign: "center"
    }
});

class PepePageInner extends React.Component {

    render() {
        const { classes, data, pepeId, isLoading, error, hasWeb3, wallet } = this.props;

        if (error) {
            console.log("Error while loading pepe: "+error.msg);
            return <div className={classes.loadingError}>
                { /* TODO some funny error-page art (?) */ }
                <Typography variant="title">Failed to load pepe.</Typography>
            </div>;
        }

        const pepe = data;


        let motherEl;
        if (!isLoading && pepe.mother !== "0") {
            motherEl = (<PepeGridItemLoadable pepeId={pepe.mother}/>)
        }

        let fatherEl;
        if (!isLoading && pepe.father !== "0") {
            fatherEl = (<PepeGridItemLoadable pepeId={pepe.father}/>)
        }

        // Check if the pepe is being auctioned, and format the prices if so.
        const isForCozy = !isLoading && pepe.cozy_auction !== undefined && !pepe.cozy_auction.isExpired();
        const cozyPrice = isForCozy ? pepe.cozy_auction.getCurrentPrice() : undefined;
        const isForSale = !isLoading && pepe.sale_auction !== undefined && !pepe.sale_auction.isExpired();
        const salePrice = isForSale ? pepe.sale_auction.getCurrentPrice() : undefined;

        let userIsOwner = hasWeb3 && hasAccount(wallet, pepe.master);

        return (

            <div className={classes.root}>

                { /* Use an empty div, stretched to the size of the parent element,
                 to tint the background with the pepe background color*/ }
                <div className={classes.backgroundFill} style={isLoading ? {} : {backgroundColor: pepe.look.background}}/>


                <div className={classes.mainInfo}>

                    <Grid container spacing={16}>
                        <Grid item xs={12}>

                            { /* quick auction info + share button */ }
                            <div className={classes.header}>
                                <div>

                                    { isForCozy && <CozyChip auctionPrice={cozyPrice}/> }
                                    { isForSale && <SaleChip auctionPrice={salePrice}/> }
                                </div>
                                {/*<div>*/}
                                    {/*<Button variant="fab" mini*/}
                                            {/*aria-label="share">*/}
                                        {/*<Share />*/}
                                    {/*</Button>*/}
                                {/*</div>*/}
                            </div>

                        </Grid>

                        { /* Header */ }
                        <Grid item xs={12}>
                            <PepeSummary pepe={pepe}/>
                        </Grid>

                        { !isLoading && hasWeb3 &&
                        <Grid item xs={12}>
                            <PepeActions pepe={pepe} />
                        </Grid>
                        }

                        { /* Price info + charts */ }

                        {(isForSale || isForCozy) && (
                            <Grid item xs={12} md={4}>
                                <PepeAuctionInfo auctionType={isForSale ? "sale" : "cozy"} pepe={pepe}/>
                            </Grid>
                        )}

                        {isForSale && (
                            <Grid item xs={12} md={8}>
                                <Card className={classes.auctionChartCard}>
                                    <PepeAuctionChart auctionType="sale" auctionData={pepe.sale_auction}/>
                                </Card>
                            </Grid>
                        )}

                        {isForCozy && (
                            <Grid item xs={12} md={8}>
                                <Card className={classes.auctionChartCard}>
                                    <PepeAuctionChart  auctionType="cozy" auctionData={pepe.cozy_auction}/>
                                </Card>
                            </Grid>
                        )}


                        { /* Bio-text */ }
                        <Grid className={classes.detailSection}  item xs={12} md={6}>
                            <h3 className={classes.infoHeading}>Bio</h3>
                            <Card className={classes.detailSectionCard}>
                                <CardContent>
                                    {isLoading ?
                                        (
                                            <Loading variant="bar-tag">Loading Pepe Bio...</Loading>
                                        ) : (
                                            <PepeBio pepe={pepe}/>
                                        )
                                    }
                                </CardContent>
                            </Card>
                        </Grid>

                        { /* Attribute list */ }
                        <Grid className={classes.detailSection} item xs={12} md={6}>
                            <h3 className={classes.infoHeading}>Pepe Attributes</h3>
                            <Card className={classes.detailSectionCard}>
                                <CardContent>
                                    {isLoading ?
                                        (
                                            <Loading variant="bar-tag">Loading Pepe Attributes...</Loading>
                                        ) : (
                                            <PepeAttributes look={pepe.look}/>
                                        )
                                    }
                                </CardContent>
                            </Card>
                        </Grid>

                        { /* Family */ }
                        { motherEl !== undefined && fatherEl !== undefined && (
                            <Grid item xs={12}>
                                <h3 className={classes.infoHeading}>Parents</h3>
                                <div className={classes.parentsInfo}>
                                    <div className={classes.parentsInfoItem}>{motherEl}</div>
                                    <div className={classes.parentsInfoItem}>{fatherEl}</div>
                                </div>
                            </Grid>)
                        }
                        { !isLoading && (
                            <Grid item xs={12}>
                                <SimplePepeGrid hideHeaderOnNoResults header={
                                    <h3 className={classes.infoHeading}>Children</h3>}
                                                  queries={[
                                    Query.buildQuery({mother: pepe.pepeId}),
                                    Query.buildQuery({father: pepe.pepeId})
                                ]}/>
                            </Grid>
                        )}

                    </Grid>
                </div>
            </div>
        );
    }
}


const StyledPepePageInner = withStyles(styles)(PepePageInner);

const LoadingPepePage = withLoading((props) => PepeAPI.getPepeData(props.pepeId))(StyledPepePageInner);

LoadingPepePage.propTypes = {
    pepeId: PropTypes.string.isRequired
};

const ConnectedPepePage = connect(state => ({
    hasWeb3: state.web3.hasWeb3,
    wallet: state.redapp.tracking.accounts.wallet
}))(LoadingPepePage);

const PepePage = reloadable(ConnectedPepePage);

export default PepePage;

