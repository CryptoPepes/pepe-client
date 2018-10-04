import React from "react";
import {Grid} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles/index";


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
    }
});

const BreedingSection = ({classes}) => (
    <div className={classes.root}>
        <Grid container spacing={40} justify="center">
            <Grid item xs={12} sm={10} md={8}>


                <h3 className={classes.sectionTitle}>Breeding</h3>
                <p className={classes.sectionText}>
                    You can breed your CryptoPepes. The look of new pepes look will depend
                    on the genes of it's parents.
                    Some characteristics are rarer than others but make your pepe more
                    valuable if they have them.
                    There are literaly billions of possible CryptoPepes so no two will be
                    the same.
                </p>
            </Grid>
            <Grid item xs={12} sm={10} md={8}>
                <img src="/img/home/pepebreeding.svg" alt="Breed CryptoPepes"/>
            </Grid>
        </Grid>
    </div>
);

export default withStyles(styles)(BreedingSection);