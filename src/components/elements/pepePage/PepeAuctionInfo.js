import React from "react";
import {withStyles} from "@material-ui/core/styles";
import {Card, CardContent, Typography, Button} from "@material-ui/core";
import Moment from 'react-moment';
import PriceText from "../util/PriceText";
import PepeBuyDialog from "../actions/auction-taker/PepeBuyDialog";
import connect from "react-redux/es/connect/connect";
import {AuctionData} from "../../../api/model";
import pepeAT from "../../../reducers/pepe/pepeAT";

const styles = (theme) => ({
    root: {
        // TODO style auction text better.
        ...theme.typography.body2,
        height: "100%"
    },
    buyBtn : {
        marginLeft: "auto",
        marginRight: "auto"
    }
});

class PepeAuctionInfo extends React.Component {

    constructor() {
        super();

        this.state = {
            buyDialogOpen: false
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: this.props.auctionType === "cozy" ? pepeAT.GET_COZY_AUCTION : pepeAT.GET_SALE_AUCTION,
            pepeId: this.props.pepeId
        });
    }

    handleBuyDialog = (open) => () => {
        this.setState({
            buyDialogOpen: open
        });
    };

    render() {

        const {classes, pepeId, auctionData, auctionType} = this.props;

        // TODO: add reload button.
        if (auctionData.status === "error") {
            return <div>
                <Typography variant="headline" component="h2">Failed to load auction data.</Typography>
            </div>;
        }
        const isLoading = auctionData.status !== "ok";

        const auction = isLoading ? null : (auctionData.auction ? new AuctionData(auctionData.auction) : null);

        const price = isLoading ? null : (auction ? auction.getCurrentPrice() : null);

        if (isLoading || price === null || price === undefined) {
            return (
            <Card className={classes.root}>
                <CardContent>
                    <p>
                        No price data available!
                    </p>
                </CardContent>
            </Card>);
        }

        let actionEl = (auctionType === "sale")
            ? (
                <div>
                    <Button variant="raised" color="secondary" className={classes.buyBtn}
                            onClick={this.handleBuyDialog(true)}>
                        Buy
                    </Button>

                    <PepeBuyDialog open={this.state.buyDialogOpen}
                                   pepeId={pepeId}
                                   onClose={this.handleBuyDialog(false)}/>
                </div>
            )
            : (
                <div>
                    Add to cozy time planner to hop your pepe with this pepe.
                </div>
            );
        return (

            <Card className={classes.root}>
                <CardContent>

                    {auctionType === "sale" && <Typography variant="title">Pepe for sale!</Typography>}
                    {auctionType === "cozy" && <Typography variant="title">Pepe is hopping!</Typography>}

                    {isLoading ? "Loading..."
                        : <div>
                            <p>Current price: <PriceText priceWei={price}/></p>

                            { /* Disable update on interval, price + chart will get out of sync with the time otherwise. */}
                            <p>Auction started <Moment unix fromNow interval={0}>{auction.beginTime}</Moment></p>
                            <p>Ends <Moment unix fromNow interval={0}>{auction.endTime}</Moment></p>

                            <p>Started at: <PriceText priceWei={auction.beginPrice}/></p>
                            <p>Price goes to: <PriceText priceWei={auction.endPrice}/></p>

                            {actionEl}
                        </div>
                    }

                </CardContent>
            </Card>
        );

    }
}

const StyledPepeAuctionInfo = withStyles(styles)(PepeAuctionInfo);

const ConnectedPepeAuctionInfo = connect((state, props) => {
    // Get the right auction data
    const auctionData = props.auctionType === "sale" ? state.pepe.saleAuctions[props.pepeId] : state.pepe.cozyAuctions[props.pepeId];
    return ({
        auctionData: (auctionData && (auctionData.web3 || auctionData.api)) || {}
    });
})(StyledPepeAuctionInfo);

export default ConnectedPepeAuctionInfo;


