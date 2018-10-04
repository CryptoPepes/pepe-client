import React from "react";
import {Grid, Button} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles/index";
import {Link} from "react-router-dom";
import {Query} from "../../../api/query_helper";
import SimplePepeGrid from "../grid/SimplePepeGrid";


const styles = theme => ({
    root: {
        padding: 20
    },
    sectionTitle: {
        ...theme.typography.display1,
        color: theme.palette.primary.main,
        marginBottom: theme.spacing.unit * 3,
        textAlign: "center",
        fontFamily: "PT Sans"
    },
    sectionText: {
        ...theme.typography.subheading,
        textAlign: "center",
        fontFamily: "PT Sans",
        fontSize: 20
    },
    getYourPepe: {
        margin: "0 auto"
    },
    getYourPepeContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }
});

const CollectingSection = ({classes}) => (
    <div className={classes.root}>
        <Grid container spacing={40} justify="center">
            <Grid item xs={12} sm={10} md={8}>

                <h3 className={classes.sectionTitle}>Collecting</h3>

                <p className={classes.sectionText}>
                    CryptoPepes are unique! They are really desirable and can be collected
                    in the CryptoPepes custom developed wallet!

                    Let us show you a collection of the newest pepes:
                </p>

            </Grid>


            <Grid item xs={12}>
                <SimplePepeGrid justify="center" queries={[
                    Query.buildQuery({sort: "newest-first", limit: 4})]}/>
            </Grid>

            <Grid item xs={12} className={classes.getYourPepeContainer}>
                <Button component={Link} to="/marketplace" variant="raised"
                        color="secondary" className={classes.getYourPepe} size="large">
                    Get Your Pepe Now!</Button>
            </Grid>
        </Grid>
    </div>
);

export default withStyles(styles)(CollectingSection);