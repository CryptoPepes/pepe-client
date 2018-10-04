import React from "react";
import {withStyles} from "@material-ui/core/styles";
import PepeGridItem from "../grid/PepeGridItem";
import {Hidden} from "@material-ui/core";
import PropTypes from "prop-types";
import loadablePepeCollection from "../grid/loadablePepeCollection";

const styles = theme => ({
    root: {
        margin: 40,
        [theme.breakpoints.down('xs')]: {
            height: 400,
            width: 320,
        },
        [theme.breakpoints.between('sm', 'md')]: {
            height: 500,
            width: 400,
        },
        [theme.breakpoints.up('lg')]: {
            height: 600,
            width: 480,
        },
    },
    deck: {
        position: "relative",
    },
    entry: {
        overflow: "visible",
        position: "absolute"
    }
});

const MarketPreviewInner = ({classes, items=[]}) => {

    const deck = [];
    for (let i = items.length - 1; i >= 0 ; i--) {

        const pepe = items[i];

        let component = (
        <div style={{top: i * 50, right: i * 80}} className={classes.entry}>
            <PepeGridItem pepe={pepe}/>
        </div>);

        if (i > 2) {
            component = (<Hidden key={pepe.pepeId} mdDown>{component}</Hidden>);
        } else if (i > 1) {
            component = (<Hidden key={pepe.pepeId} xsDown>{component}</Hidden>);
        } else {
            component = (<div key={pepe.pepeId}>{component}</div>)
        }

        deck.push(component);
    }

    return (
        <div className={classes.root}>
            <div className={classes.deck}>
                {deck}
            </div>
        </div>
    );
};

const styledMarketPreviewInner = withStyles(styles)(MarketPreviewInner);

const MarketPreview = loadablePepeCollection(styledMarketPreviewInner);

MarketPreview.propTypes = {
    queries: PropTypes.arrayOf(PropTypes.PropTypes.object)
};

export default MarketPreview;