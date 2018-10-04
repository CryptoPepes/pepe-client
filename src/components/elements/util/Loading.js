import React from "react";
import {withStyles} from "@material-ui/core/styles/index";
import {LinearProgress, CircularProgress} from "@material-ui/core";
import PropTypes from "prop-types";

const stylesBar = (theme) => ({
    root: {
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        alignItems: "center"
    },
    text: {
        ...theme.typography.body1,
        fontStyle: "italic",
        minWidth: 100,
        textAlign: "center"
    }
});

const LoadingInner = ({classes, variant, children}) => (

    <div className={classes.root}>
        {(variant === "circle" || variant === "circle-tag") &&
            <CircularProgress color="primary"/>
        }

        {(variant === "bar-tag" || variant === "text" || variant === "circle-tag") &&
            (
                <div className={classes.text}>{children}</div>
            )
        }

        {(variant === "bar" || variant === "bar-tag") &&
            <LinearProgress color="primary" className={classes.bar}/>
        }
    </div>

);


const Loading = withStyles(stylesBar)(LoadingInner);

Loading.defaultProps = {
    variant: "bar-tag"
};

/*
 * circle: just a circular loading indicator
 * circle-tag: circle, with text
 * bar: horizontal bar loading indicator
 * bar-tag: bar, with text
 * text: just text
 */
Loading.propTypes = {
    variant: PropTypes.oneOf(['circle', 'circle-tag', 'bar-tag', 'text'])
};

export default Loading;