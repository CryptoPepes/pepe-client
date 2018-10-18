import React from "react";
import connect from "react-redux/es/connect/connect";
import {Typography} from "@material-ui/core";
import PepeAuctionChartInner from "./PepeAuctionChartInner";

const PepeAuctionChart = (props) => {
    const {auctionData, auctionType} = props;

    // TODO: add reload button.
    if (auctionData.status === "error") {
        return <div>
            <Typography variant="headline" component="h2">Failed to load auction data.</Typography>
        </div>;
    }

    const isLoading = auctionData.status !== "ok";
    if (isLoading) {
        return <div>
            <Typography variant="caption" component="h3">Loading auction data...</Typography>
        </div>;
    }

    const auction = auctionData.auction;

    return <PepeAuctionChartInner auction={auction} auctionType={auctionType}/>;

};

const ConnectedPepeAuctionChart  = connect((state, props) => {
    // Get the right auction data
    const auctionData = props.auctionType === "sale" ? state.pepe.saleAuctions[props.pepeId] : state.pepe.cozyAuctions[props.pepeId];
    return ({
        auctionData: (auctionData && (auctionData.web3 || auctionData.api)) || {}
    });
})(PepeAuctionChart);

export default ConnectedPepeAuctionChart;

