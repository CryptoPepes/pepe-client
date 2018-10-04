import React from "react";
import {Grid} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles/index";


const styles = theme => ({
    root: {
        padding: 20,
        paddingBottom: 100
    },
    caption: {
        ...theme.typography.caption,
        fontSize: 18,
        color: "#999",
        fontFamily: "Roboto Condensed"
    },
    blockbar: {
        opacity: ".6",
        maxWidth: "70%",
        marginTop:-10
    },
    crypto010: {
        opacity:".6",
        maxWidth: "80%"
    }
});

const SeenOnSection = ({classes}) => (
    <div className={classes.root}>
        <Grid container spacing={40} justify="center">
            <Grid item xs={12} sm={12} md={12} align="center">
                <h4 className={classes.caption}>AS SEEN ON:</h4>
            </Grid>

            <Grid item xs={12} sm={6} md={3} align="center">
                <a href="https://www.blockbar.nl/biw/" target="_blank"><img
                    src="/img/home/blockbar.png" className={classes.blockbar}/></a>
            </Grid>

            <Grid item xs={12} sm={6} md={3} align="center">
                <a href="https://crypto010.nl" target="_blank"><img
                    src="/img/home/crypto010.png" className={classes.crypto010}/></a>
            </Grid>

        </Grid>
    </div>
);

export default withStyles(styles)(SeenOnSection);