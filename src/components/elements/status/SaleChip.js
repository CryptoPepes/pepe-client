import React from "react";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {Tag} from "mdi-material-ui";
import {Chip} from "@material-ui/core";
import PriceText from "../util/PriceText";
import connect from "react-redux/es/connect/connect";
import {AuctionData} from "../../../api/model";

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
    const {auctionData, classes} = props;

    const isLoading = auctionData.status !== "ok";

    const price = isLoading ? null : new AuctionData(auctionData).getCurrentPrice();

    return (
        <Chip label={<span className={classes.labelRoot}>
            <Tag className={classes.mainIcon}/> <i className={classes.mainText}>For sale</i>
                <PriceText priceWei={price}/>
            </span>
        }/>
    )

};

const StyledSaleChip = withStyles(styles)(SaleChip);

const ConnectedSaleChip = connect((state, props) => {
    // Get the right auction data
    const auctionData = state.pepe.cozyAuctions[props.pepeId];
    return ({
        auctionData: (auctionData && (auctionData.web3 || auctionData.api)) || {}
    });
})(StyledSaleChip);

ConnectedSaleChip.propTypes = {
    pepeId: PropTypes.string
};

export default ConnectedSaleChip;
