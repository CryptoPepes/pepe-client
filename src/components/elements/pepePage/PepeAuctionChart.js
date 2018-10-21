import React from "react";
import connect from "react-redux/es/connect/connect";
import {Typography} from "@material-ui/core";
import PepeAuctionChartInner from "./PepeAuctionChartInner";
import pepeAT from "../../../reducers/pepe/pepeAT";

class PepeAuctionChart extends React.Component {

    componentDidMount() {
        this.props.dispatch({
            type: this.props.auctionType === "cozy" ? pepeAT.GET_COZY_AUCTION : pepeAT.GET_SALE_AUCTION,
            pepeId: this.props.pepeId
        });
    }

    render() {
        const {auctionData, auctionType} = this.props;

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
        if (!auction) {
            return <div>
                <Typography variant="caption" component="h3">No auction data found...</Typography>
            </div>;
        }

        return <PepeAuctionChartInner auction={auction} auctionType={auctionType}/>;
    }

}

const ConnectedPepeAuctionChart  = connect((state, props) => {
    // Get the right auction data
    const auctionData = props.auctionType === "sale" ? state.pepe.saleAuctions[props.pepeId] : state.pepe.cozyAuctions[props.pepeId];
    return ({
        auctionData: (auctionData && (auctionData.web3 || auctionData.api)) || {}
    });
})(PepeAuctionChart);

export default ConnectedPepeAuctionChart;

