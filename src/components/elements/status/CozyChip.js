import React from "react";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {Fire} from "mdi-material-ui";
import {Chip} from "@material-ui/core";
import PriceText from "../util/PriceText";
import connect from "react-redux/es/connect/connect";
import {AuctionData} from "../../../api/model";

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
    const {auctionData, classes} = props;

    const isLoading = auctionData.status !== "ok";

    const price = isLoading ? null : new AuctionData(auctionData.auction).getCurrentPrice();

    return (
        <Chip label={
            <span className={classes.labelRoot}>
                <Fire/> <i className={classes.mainText}>Wants to hop</i>
                <PriceText priceWei={price}/>
            </span>
        }/>
    )

};

const StyledCozyChip = withStyles(styles)(CozyChip);

const ConnectedCozyChip = connect((state, props) => {
    const auctionData = state.pepe.cozyAuctions[props.pepeId];
    return ({
        auctionData: (auctionData && (auctionData.web3 || auctionData.api)) || {}
    });
})(StyledCozyChip);

ConnectedCozyChip.propTypes = {
    pepeId: PropTypes.string
};

export default ConnectedCozyChip;
