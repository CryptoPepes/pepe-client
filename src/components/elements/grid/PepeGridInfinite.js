import React, { Component } from "react";
import MasonryInfiniteScroller from 'react-masonry-infinite';
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import PepeGridItem from "./PepeGridItem";
import {Button, Grid} from "@material-ui/core";
import {Query} from "../../../api/query_helper";
import Loading from "../util/Loading";
import connect from "react-redux/es/connect/connect";
import pepeAT from "../../../reducers/pepe/pepeAT";

const styles = theme => ({
    root: {
        maxWidth: "100%",
        marginTop: 30,
        padding: 20
    },
    itemContainer: {
        width: 240
    },
    endStatusIndicator: {
        padding: theme.spacing.unit * 8
    }
});

class PepeGridInfinite extends Component {

    constructor(props) {
        super(props);

        // Not using state var here, it has to be instant, and may be dropped without problem if the component changes.
        this.currentQuery = "";
    }

    makeContentLoader = (force) => (
        (async function loadMoreContent() {
            const { hasMore, cursor, getQuery, dispatch } = this.props;

            // Do not load anything if there is no more data to be loaded.
            if (!hasMore) return;

            console.log("Loading pepes...");

            let q = getQuery();

            //Get a copy of the query, to modify the cursor on.
            if (q === undefined) q = Query.buildQuery({});
            else q = q.getCopy();

            //set the cursor if necessary
            if(cursor !== undefined) q.changeCursor(this.contentCursor);

            //get the query string
            const qStr = q.toURLParamStr();

            //If this is a different query, then reset the state.
            if (force || this.currentQuery !== qStr) {
                this.currentQuery = qStr;
                console.log("Search query changed / moved page!");
            } else {
                //Query identities match, we are already loading
                console.log("Avoiding double API query.");
                return;
            }

            // Make redux do the hard work of fetching and updating data.
            dispatch({
                type: pepeAT.QUERY_PEPES, queryStr: qStr, force
            });
        })).bind(this);

    render() {

        const { items, error, hasMore, classes } = this.props;

        let statusEl = (<div/>);
        if (error) {
            statusEl = (<div>Failed...
                <Button variant="raised" color="secondary" onClick={this.makeContentLoader(true)}>
                    Reload?
                </Button>
            </div>)
        } else if (hasMore) {
            // Just hint that there is more.
            statusEl = (<Loading variant="circle" className={classes.endStatusIndicator}/>);
        }

        return (
            <div className={classes.root}>

                <Grid container justify="center" spacing={40}>
                        <Grid item>
                            <MasonryInfiniteScroller
                                hasMore={hasMore}
                                loadMore={this.makeContentLoader(false)}
                                position={true}
                                sizes={[
                                    // Use the same breakpoints as Material UI
                                    // (See https://material-ui-next.com/layout/basics/#breakpoints)
                                    { columns: 1, gutter: 10 },//               xs
                                    { mq: '600px', columns: 2, gutter: 20 },//  sm
                                    { mq: '960px', columns: 3, gutter: 20 },//  md
                                    { mq: '1280px', columns: 4, gutter: 20 },// lg
                                    { mq: '1920px', columns: 5, gutter: 20 }//  xl
                                    ]}
                            >
                                {
                                    items.map(pepeId => (
                                        <div key={pepeId} className={classes.itemContainer}>
                                            <PepeGridItem pepeId={pepeId}/>
                                        </div>
                                    ))
                                }
                            </MasonryInfiniteScroller>
                            <div>
                                {statusEl}
                            </div>
                        </Grid>
                </Grid>
            </div>
        )
    }
}

const StyledPepeGridInfinite = withStyles(styles)(PepeGridInfinite);

const ConnectedPepeGridInfinite = connect((state, props) => {
    const query = props.getQuery();
    let queryStr = "";
    let cursor = null;
    let queryErr = null;
    const results = [];
    let hasMore = true;
    // If we have a query...
    if (query) {
        // Then keep looking in the store for data...
        while (hasMore) {
            // Get the next query
            if (cursor) query.changeCursor(cursor);
            const nextQueryStr = query.toURLParamStr();

            // Get the data of the query
            const nextQueryResults = state.pepe.pepeQueries[nextQueryStr];

            // Check if we have it
            if (nextQueryResults) {
                queryStr = nextQueryStr;
                // We have data for this query
                // Check if the query resulted in an error
                if (nextQueryResults.error) {
                    // Error, stop looking for new data
                    queryErr = nextQueryResults.error;
                    // We know there is more data however.
                    hasMore = true;
                    break;
                } else {
                    // No error, great, add the data to the collection,
                    // then continue looking for more data using the next cursor.
                    results.push(...nextQueryResults.pepeIds);
                    cursor = nextQueryResults.cursor;
                    // If we do not have a cursor, there is no more data.
                    hasMore = !!cursor;
                }
            } else {
                // Stop when we cannot find new results anymore
                break;
            }
        }
    }
    return ({
        items: results,
        error: queryErr,
        lastQueryStr: queryStr,
        cursor,
        hasMore
    })
})(StyledPepeGridInfinite);

ConnectedPepeGridInfinite.propTypes = {
    getQuery: PropTypes.func.isRequired
};

export default ConnectedPepeGridInfinite;