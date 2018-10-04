import React from "react";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {Tag} from "mdi-material-ui";
import {Chip} from "@material-ui/core";
import PriceText from "../util/PriceText";

const styles = (theme) => ({
    labelRoot: {
        display: "flex",
        alignItems: "center"
    },
    mainIcon: {
        marginTop: 2,
        fontSize: 18
    },
    mainText: {
        marginLeft: 4,
        marginRight: 12,
        fontWeight: 500
    }
});

const SaleChip = (props) => {
    const {auctionPrice, classes} = props;

    return (
        <Chip label={<span className={classes.labelRoot}>
            <Tag className={classes.mainIcon}/> <i className={classes.mainText}>For sale</i>
                <PriceText priceWei={auctionPrice}/>
            </span>
        }/>
    )

};

SaleChip.propTypes = {
    // auction price, formatted as string, decimal base, in Wei.
    auctionPrice: PropTypes.string
};

export default withStyles(styles)(SaleChip);
