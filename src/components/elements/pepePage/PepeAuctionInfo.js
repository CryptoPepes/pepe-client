import React from "react";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {Card, CardContent, Typography, Button} from "@material-ui/core";
import Moment from 'react-moment';
import PriceText from "../util/PriceText";
import PepeBuyDialog from "../actions/auction-taker/PepeBuyDialog";

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

    handleBuyDialog = (open) => () => {
        this.setState({
            buyDialogOpen: open
        });
    };

    render() {

        const {classes, auctionType, pepe} = this.props;

        const auctionData = auctionType === "sale" ? pepe.sale_auction : pepe.cozy_auction;

        const price = auctionData.getCurrentPrice();

        if (price === undefined) {
            // if undefined: auction has not begun, or is already over.
            return (
            <Card className={classes.root}>
                <CardContent>
                    <p>
                        No price data available!
                    </p>
                </CardContent>
            </Card>);
        }

        let auctionAction = (auctionType === "sale")
            ? (
                <div>
                    <Button variant="raised" color="secondary" className={classes.buyBtn}
                            onClick={this.handleBuyDialog(true)}>
                        Buy
                    </Button>

                    <PepeBuyDialog open={this.state.buyDialogOpen}
                                   pepe={pepe}
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

                    <p>Current price: <PriceText priceWei={price}/></p>

                    { /* Disable update on interval, price + chart will get out of sync with the time otherwise. */}
                    <p>Auction started <Moment unix fromNow interval={0}>{auctionData.beginTime}</Moment></p>
                    <p>Ends <Moment unix fromNow interval={0}>{auctionData.endTime}</Moment></p>

                    <p>Started at: <PriceText priceWei={auctionData.beginPrice}/></p>
                    <p>Price goes to: <PriceText priceWei={auctionData.endPrice}/></p>

                    {auctionAction}

                </CardContent>
            </Card>
        );

    }
}

PepeAuctionInfo.propTypes = {
    pepe: PropTypes.shape({
        name: PropTypes.string,
        pepeId: PropTypes.string,
        // either cozy or sale is required.
        sale_auction: PropTypes.shape({
            beginTime: PropTypes.number,
            endTime: PropTypes.number,
            beginPrice: PropTypes.string,
            endPrice: PropTypes.string
        }),
        cozy_auction: PropTypes.shape({
            beginTime: PropTypes.number,
            endTime: PropTypes.number,
            beginPrice: PropTypes.string,
            endPrice: PropTypes.string
        })
    }).isRequired,
    auctionType: PropTypes.string.isRequired
};

export default withStyles(styles)(PepeAuctionInfo);
