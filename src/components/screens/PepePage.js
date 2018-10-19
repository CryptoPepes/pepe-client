import React from "react";
import {withStyles} from "@material-ui/core/styles";
import {Card, CardContent, Grid, Typography} from "@material-ui/core";
import PropTypes from "prop-types";
import PepeGridItem from "../elements/grid/PepeGridItem";
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
import {cozyAddr, saleAddr} from "../../web3Settings";
import QueriedPepes from "../elements/grid/QueriedPepes";


const styles = theme => ({
    root: {
        width: "100%",
        backgroundColor: theme.palette.type === "light" ? "#ddd" : "#000",
        position: "relative"
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
        const { pepeId, pepeData, hasWeb3, classes } = this.props;

        // TODO: add reload button.
        if (pepeData.status === "error") {
            return <div className={classes.loadingError}>
                { /* TODO some funny error-page art (?) */ }
                <Typography variant="title">Failed to load pepe.</Typography>
            </div>;
        }

        const pepe = pepeData.pepe;
        const isLoading = pepeData.status !== "ok";

        let motherEl;
        if (!isLoading && pepe.mother !== "0") {
            motherEl = (<PepeGridItem pepeId={pepe.mother}/>)
        }

        let fatherEl;
        if (!isLoading && pepe.father !== "0") {
            fatherEl = (<PepeGridItem pepeId={pepe.father}/>)
        }

        // Check if the pepe is being auctioned, and show extra components if it is.
        const isForCozy = !isLoading && (pepe.master === cozyAddr);
        const isForSale = !isLoading && (pepe.master === saleAddr);

        return (

            <div className={classes.root}>

                <div className={classes.mainInfo}>

                    <Grid container spacing={16}>
                        <Grid item xs={12}>

                            { /* quick auction info + share button */ }
                            <div className={classes.header}>
                                <div>
                                    { isForCozy && <CozyChip pepeId={pepeId}/> }
                                    { isForSale && <SaleChip pepeId={pepeId}/> }
                                </div>
                                {/* TODO: old share button, re-implement later */}
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
                            <PepeSummary pepeId={pepeId}/>
                        </Grid>

                        { !isLoading && hasWeb3 &&
                        <Grid item xs={12}>
                            <PepeActions pepeId={pepeId} />
                        </Grid>
                        }

                        { /* Price info */ }
                        {(isForSale || isForCozy) && (
                            <Grid item xs={12} md={4}>
                                <PepeAuctionInfo auctionType={isForSale ? "sale" : "cozy"} pepeId={pepeId}/>
                            </Grid>
                        )}

                        { /* Price chart */ }
                        {(isForSale || isForCozy) && (
                            <Grid item xs={12} md={8}>
                                <Card className={classes.auctionChartCard}>
                                    <PepeAuctionChart auctionType={isForSale ? "sale" : "cozy"} pepeId={pepeId}/>
                                </Card>
                            </Grid>
                        )}

                        { /* Bio-text */ }
                        <Grid className={classes.detailSection}  item xs={12} md={6}>
                            <h3 className={classes.infoHeading}>Bio</h3>
                            <Card className={classes.detailSectionCard}>
                                <CardContent>
                                    <PepeBio pepeId={pepeId}/>
                                </CardContent>
                            </Card>
                        </Grid>

                        { /* Attribute list */ }
                        <Grid className={classes.detailSection} item xs={12} md={6}>
                            <h3 className={classes.infoHeading}>Pepe Attributes</h3>
                            <Card className={classes.detailSectionCard}>
                                <CardContent>
                                    <PepeAttributes pepeId={pepeId}/>
                                </CardContent>
                            </Card>
                        </Grid>

                        { /* Family: parents */ }
                        { motherEl !== undefined && fatherEl !== undefined && (
                            <Grid item xs={12}>
                                <h3 className={classes.infoHeading}>Parents</h3>
                                <div className={classes.parentsInfo}>
                                    <div className={classes.parentsInfoItem}>{motherEl}</div>
                                    <div className={classes.parentsInfoItem}>{fatherEl}</div>
                                </div>
                            </Grid>)
                        }

                        { /* Family: children */ }
                        <Grid item xs={12}>
                            <QueriedPepes queries={[
                                Query.buildQuery({mother: pepeId}).toURLParamStr(),
                                Query.buildQuery({father: pepeId}).toURLParamStr()
                            ]}>
                                <h3 className={classes.infoHeading}>Children</h3>
                            </QueriedPepes>
                        </Grid>

                    </Grid>
                </div>
            </div>
        );
    }
}


const StyledPepePageInner = withStyles(styles)(PepePageInner);

const ConnectedPepePage = connect((state, props) => ({
    hasWeb3: state.web3.hasWeb3,
    pepeData: (state.pepe.pepes[props.pepeId] && (state.pepe.pepes[props.pepeId].web3 || state.pepe.pepes[props.pepeId].api)) || {}
}))(StyledPepePageInner);

ConnectedPepePage.propTypes = {
    pepeId: PropTypes.string.isRequired
};

export default ConnectedPepePage;

