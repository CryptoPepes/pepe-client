import React from "react";
import {Typography} from "@material-ui/core";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";

//TODO: RTL-LTR support
const styles = (theme) => ({
    helper: {
        borderLeft: `2px solid ${theme.palette.text.lightDivider}`,
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    }
});

const HelperText = (props) => {

    const classes = props.classes;

    let learnMoreEl = null;

    if (props.learnMore) {
        learnMoreEl = (
            <Typography variant="caption">
                <Link className={classes.link} to={props.learnMore}>
                    Learn more
                </Link>
            </Typography>
        )
    }

    return (
        <div className={classes.helper}>
            {props.children}
            {learnMoreEl}
        </div>
    )
};


HelperText.propTypes = {
    classes: PropTypes.object.isRequired,
    learnMore: PropTypes.string,
};

export default withStyles(styles)(HelperText);
