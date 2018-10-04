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
        fontFamily: "PT Sans"
    },
    sectionText: {
        ...theme.typography.subheading,
        fontFamily: "PT Sans",
        fontSize: 20
    },
    pepe: {
        marginBottom: theme.spacing.unit * 2,
        borderBottom: theme.palette.type === 'light' ? "1px solid #333" : "1px solid #ccc"
    }
});

const MiningSection = ({classes}) => (
    <div className={classes.root}>
        <Grid container spacing={40} alignItems="center" justify="center">
            <Grid item xs={12} sm={5} md={5}>
                <img className={classes.pepe}
                     src="/img/home/pepemasterminer.svg" alt="Pepe"/>
            </Grid>
            <Grid item xs={12} sm={7} md={7}>

                <h3 className={classes.sectionTitle}>Mining</h3>
                <p className={classes.sectionText}>
                    You can earn PEP tokens and Gen 0 CryptoPepes by putting your
                    computer to work during the CryptoPepes Rat Race! Approximately
                    every 8 minutes a miner gets rewarded 2500PEP tokens and every
                    16th block a miner will also get a GEN 0 CryptoPepe. Only 1100
                    GEN 0 Pepes will ever be created!
                </p>
                <p className={classes.sectionText}>
                    PEP tokens and CryptoPepes are 100% owned by you and stored in
                    your personal wallet.
                </p>

                <p className={classes.sectionText}>
                    The <strong>CryptoPepes Rate Race 🐭</strong> will last for 3
                    months. After 3 months 40 million PEP tokens will have been
                    mined and 1000 Gen 0 CryptoPepes. CryptoPepes will then
                    transition into DPOS.
                </p>
            </Grid>
        </Grid>
    </div>
);

export default withStyles(styles)(MiningSection);