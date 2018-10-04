import React from "react";
import {withStyles} from "@material-ui/core/styles/index";
import AdvancedLink from "./AdvancedLink";
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
        minWidth: 100
    },
    web3Color: {
        // The Metamask color, because that's what people associate with Web3...
        color: "#F79220"
    },
    circle: {
        color: "#F79220",
    },
    bar: {
        width: "100%"
    },
    barColor: {
        backgroundColor: "#F79220"
    },
    barBackground: {
        backgroundColor: "#C1C1C1"
    }
});

const Web3LoadingInner = ({classes, variant}) => (

    <div className={classes.root}>
        {(variant === "circle" || variant === "circle-tag") &&
            <CircularProgress color="primary" className={classes.circle}/>
        }

        {(variant === "bar-tag" || variant === "text" || variant === "circle-tag") &&
            (
                <span className={classes.text}>
                    Loading <AdvancedLink to="/faq#what-is-web3" disableLinkPadding>
                        <span className={classes.web3Color}>Web3</span>
                    </AdvancedLink>...</span>
            )
        }

        {(variant === "bar" || variant === "bar-tag") &&
            <LinearProgress color="primary" className={classes.bar}
                            classes={
                                {
                                    barColorPrimary: classes.barColor,
                                    barColorSecondary: classes.barBackground
                                }
                            }/>
        }
    </div>

);


const Web3Loading = withStyles(stylesBar)(Web3LoadingInner);


Web3Loading.defaultProps = {
    variant: "bar-tag"
};

/*
 * circle: just a circular loading indicator
 * circle-tag: circle, with text
 * bar: horizontal bar loading indicator
 * bar-tag: bar, with text
 * text: just text
 */
Web3Loading.propTypes = {
    variant: PropTypes.oneOf(['circle', 'circle-tag', 'bar-tag', 'text'])
};

export default Web3Loading;