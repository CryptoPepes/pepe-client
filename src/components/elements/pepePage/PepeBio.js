import React from "react";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {Card, CardContent, Typography} from "@material-ui/core";
import Moment from "react-moment";

const styles = (theme) => ({
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
});

const PepeBio = (props) => {
    const {pepe, classes} = props;

    const isLoading = pepe === undefined;

    const bull = <span className={classes.bullet}>•</span>;

    let nameEl;
    if (isLoading) {
        nameEl = (<span>Pepe ?</span>)
    } else if (pepe.name !== null) {
        nameEl = (<strong>{pepe.name}</strong>)
    } else {
        nameEl = (<span>Pepe #{pepe.pepeId}</span>)
    }

    return (
        <div>
            <Typography variant="headline" component="h2">
                Hello, I'm {nameEl}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
                {pepe.bio_title || "?"} {bull}
                <i>Born on <Moment unix format="YYYY/MM/DD" interval={0}>{pepe.birth_time || 0}</Moment></i>
            </Typography>
            <br/>
            <Typography component="p">
                {pepe.bio_description || "???"}
            </Typography>
        </div>
    );

};

PepeBio.propTypes = {
    // when pepe is undefined -> loading placeholder is shown
    pepe: PropTypes.shape({
        name: PropTypes.string,
        pepeId: PropTypes.string,
        bio_title: PropTypes.string,
        bio_description: PropTypes.string,
        birth_time: PropTypes.number
    })
};

export default withStyles(styles)(PepeBio);
