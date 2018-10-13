import React from "react";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {Typography} from "@material-ui/core";

const styles = (theme) => ({

});

const PepeBio = (props) => {
    const {pepe, classes} = props;

    const isLoading = pepe === undefined;

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
            <Typography color="textSecondary">
                {pepe.bio_title || "?"}
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
