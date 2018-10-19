import {withStyles} from "@material-ui/core/styles";
import React from "react";
import PropTypes from "prop-types";
import Web3Utils from "web3-utils";

const styles = theme => ({
    priceText: {
        width: 80,
        textOverflow: "ellipsis",
        overflow: "hidden"
    }
});

// For now, we just clip it to 80 pixels, and show an ellipsis on overflow.
// No rounding mistakes if the user gets to see that there are actually more decimals.
const PriceText = ({classes, priceWei, ...otherProps}) =>
    (
        <span className={classes.priceText} {...otherProps}> Ξ {
            !priceWei
                ? "???"
                : Web3Utils.fromWei(priceWei, "ether")
        }</span>
    );

PriceText.propTypes = {
    classes: PropTypes.object.isRequired,
    priceWei: PropTypes.any
};

export default withStyles(styles)(PriceText);