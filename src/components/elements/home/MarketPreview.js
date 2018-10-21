import React from "react";
import {withStyles} from "@material-ui/core/styles";
import PepeGridItem from "../grid/PepeGridItem";
import {Hidden} from "@material-ui/core";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import Loading from "../util/Loading";
import pepeAT from "../../../reducers/pepe/pepeAT";

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

class MarketPreviewInner extends React.Component {

    componentDidMount() {
        this.props.dispatch({
            type: pepeAT.QUERY_PEPES,
            queryStr: this.props.queryStr,
            force: false
        });
    }

    render() {

        const {classes, pepeIds} = this.props;

        if (!pepeIds) {
            return <Loading variant="circle-tag">Loading pepes...</Loading>
        }

        const deck = [];
        for (let i = pepeIds.length - 1; i >= 0; i--) {

            const pepeId = pepeIds[i];

            let component = (
                <div style={{top: i * 50, right: i * 80}} className={classes.entry}>
                    <PepeGridItem pepeId={pepeId}/>
                </div>);

            if (i > 2) {
                component = (<Hidden key={pepeId} mdDown>{component}</Hidden>);
            } else if (i > 1) {
                component = (<Hidden key={pepeId} xsDown>{component}</Hidden>);
            } else {
                component = (<div key={pepeId}>{component}</div>)
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
    }
}

const StyledMarketPreview = withStyles(styles)(MarketPreviewInner);

const ConnectedMarketPreview = connect((state, props) => {

    const queryStr = props.queryStr;

    const queryData = state.pepe.pepeQueries[queryStr] || { pepeIds: null, err: null };

    return ({
        pepeIds: queryData.pepeIds,
        error: queryData.err
    })
})(StyledMarketPreview);

ConnectedMarketPreview.propTypes = {
    queryStr: PropTypes.string.isRequired
};

export default ConnectedMarketPreview;