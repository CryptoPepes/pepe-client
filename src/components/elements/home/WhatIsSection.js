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
    }
});

const MiningSection = ({classes}) => (
    <div className={classes.root}>
        <Grid container spacing={40}  justify="center">
            <Grid item xs={8} sm={10} md={8}>
                <Grid container spacing={40} alignItems="center" justify="center">
                    <Grid item xs={12} sm={5} md={5}>
                        <img style={{width: "100%"}} src="/img/home/pepeetherface.svg" alt="Pepe N"/>
                    </Grid>
                    <Grid item xs={12} sm={7} md={7}>
                        <h3 className={classes.sectionTitle}>
                            What is CryptoPepes?
                        </h3>
                        <p className={classes.sectionText}>
                            CryptoPepes is a blockchain based game powered by Ethereum.
                            Each Pepe is born unique and has its own characteristics.
                            Each Pepe is 100% owned by you and safely stored in your wallet.
                        </p>
                        <p className={classes.sectionText}>
                            You can breed, mine, fight or trade CryptoPepes on the blockchain.
                        </p>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </div>
);

export default withStyles(styles)(MiningSection);