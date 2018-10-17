import React from "react";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {Typography} from "@material-ui/core";
import connect from "react-redux/es/connect/connect";

const styles = (theme) => ({

});

const PepeBio = (props) => {
    const {pepeId, pepeData, bioData, classes} = props;

    const pepe = pepeData.pepe;
    const pepeIsLoading = pepeData.status === "getting";
    const bio = bioData.bio;
    const bioIsLoading = bioData.status === "getting";

    let nameEl;
    if (pepeIsLoading) {
        nameEl = (<span>Pepe ?</span>)
    } else if (pepe.name !== null) {
        nameEl = (<strong>{pepe.name}</strong>)
    } else {
        nameEl = (<span>Pepe #{pepeId}</span>)
    }

    return (
        <div>
            <Typography variant="headline" component="h2">
                Hello, I'm {nameEl}
            </Typography>
            <Typography color="textSecondary">
                {bioIsLoading ? "..." : bio.title}
            </Typography>
            <br/>
            <Typography component="p">
                {bioIsLoading ? "..." : bio.description}
            </Typography>
        </div>
    );

};

const StyledPepeBio = withStyles(styles)(PepeBio);

const ConnectedPepeBio = connect((state, props) => ({
    pepeData: (state.pepe.pepes[props.pepeId] && (state.pepe.pepes[props.pepeId].web3 || state.pepe.pepes[props.pepeId].api)) || {},
    bioData: (state.pepe.bioData[props.pepeId] && (state.pepe.bioData[props.pepeId].web3 || state.pepe.bioData[props.pepeId].api)) || {}
}))(StyledPepeBio);

export default ConnectedPepeBio;
