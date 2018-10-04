import React from "react";
import {Grid} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles/index";


const styles = theme => ({
    root: {
        paddingTop: theme.spacing.unit * 4,
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
        paddingBottom: 0
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
    pepe: {
        paddingBottom: 0,
        marginBottom: -5
    }
});

const BattlingSection = ({classes}) => (
    <div className={classes.root}>
        <Grid container spacing={0} justify="center">
            <Grid item xs={12} sm={10} md={8}>


                <h3 className={classes.sectionTitle}>Battling</h3>

                <p className={classes.sectionText}>
                    You can battle other players in epic pepe battles. Choose your deck of
                    pepes and compete in tournaments to show you are the pepe champion!
                </p>
                <p className={classes.sectionText}>
                    The strengths and weaknesses of your CryptoPepes will be determined by
                    its DNA. CryptoPepes battles are expected in Q3 2018.
                </p>
            </Grid>
        </Grid>

        <Grid container spacing={0} justify="center">
            <Grid item xs={4} className={classes.pepe}>
                <img style={{width: "100%"}} src="/img/home/pepeangryhat.svg" alt="Pepe"/>
            </Grid>
            <Grid item xs={4} className={classes.pepe}>
                <img style={{width: "100%", transform: "scale(-1, 1)"}}
                     src="/img/home/pepefight.svg" alt="Pepe"/>
            </Grid>
        </Grid>
    </div>
);

export default withStyles(styles)(BattlingSection);