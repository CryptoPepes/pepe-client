import React from "react";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {Fire} from "mdi-material-ui";
import {Chip} from "@material-ui/core";
import PriceText from "../util/PriceText";

const styles = (theme) => ({
    labelRoot: {
        display: "flex",
        alignItems: "center"
    },
    mainText: {
        marginLeft: 4,
        marginRight: 12,
        fontWeight: 500
    }
});

const CozyChip = (props) => {
    const {auctionPrice, classes} = props;

    return (
        <Chip label={
            <span className={classes.labelRoot}>
                <Fire/> <i className={classes.mainText}>Wants to hop</i>
                <PriceText priceWei={auctionPrice}/>
            </span>
        }/>
    )

};

CozyChip.propTypes = {
    // auction price, formatted as string, decimal base, in Wei.
    auctionPrice: PropTypes.string
};

export default withStyles(styles)(CozyChip);
