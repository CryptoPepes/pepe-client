import React, { Component } from "react";
import MasonryInfiniteScroller from 'react-masonry-infinite';
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import PepeGridItem from "./PepeGridItem";
import {Button, Grid} from "@material-ui/core";
import {QueryData, QueryError} from "../../../api/model";
import PepeAPI from "../../../api/api";
import {Query} from "../../../api/query_helper";
import Loading from "../util/Loading";

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

        this.state = {
            hasMore: true,
            elements: [],
            loading: true,
            failed: false
        };

        this.currentQuery = undefined;
        this.contentCursor = undefined;
    }

    async loadMoreContent() {
        console.log("Loading pepes...");
        const oldPepes = [];
        let q = this.props.getQuery();

        //get the query string (without cursor), to use as identity.
        const qId = q.toURLParamStr();

        //If this is a different query, then reset the state.
        if (this.currentQuery !== qId) {
            this.currentQuery = qId;
            this.contentCursor = undefined;
        } else {
            //Query identities match, are we already loading?
            // If yes, this is the same exact query, and we shouldn't call the api twice.
            if (this.state.loading) {
                console.log("Avoiding unnecessary double API call.");
                return;
            }

            //keep old pepes in view if we're only expanding the list.
            // (scrolling down without changing filters)
            oldPepes.push(...this.state.elements);
        }

        //Get a copy of the query, to modify the cursor on.
        if (q === undefined) q = Query.buildQuery({});
        else q = q.getCopy();

        //set the cursor if necessary
        if(this.contentCursor !== undefined) q.changeCursor(this.contentCursor);

        //Do the query, wait for the results.
        const queryRes = await PepeAPI.queryPepes(q);


        if (!(queryRes instanceof QueryData)) {
            if (queryRes instanceof QueryError) {
                console.log(queryRes.errStr);
            } else {
                console.log("Failed to retrieve more content for infinite scrolling. Unknown response type.");
            }
            this.setState({hasMore: false, loading: false, failed: true});
            return;
        }

        // O(n^2), not really important however.
        // We don't expect more than 200 on one page, and 20 from api.
        // This guarantees that React will not get duplicates. (results in an error)
        const nonDuplicates = queryRes.pepes.filter((item) => oldPepes.find((other) => other.pepeId === item.pepeId) === undefined);

        this.contentCursor = queryRes.cursor;
        this.setState({
            hasMore: queryRes.hasMore,
            loading: false,
            failed: false,
            elements: [...oldPepes, ...nonDuplicates]})
    }

    render() {

        const { classes } = this.props;

        let statusEl = (<div/>);
        if (this.state.failed) {
            statusEl = (<div>Failed...
                <Button variant="raised" color="secondary" onClick={this.loadMoreContent.bind(this)}>
                    Reload?
                </Button>
            </div>)
        } else {
            if (this.state.loading) {
                statusEl = (<Loading variant="circle-tag" className={classes.endStatusIndicator}>Loading...</Loading>)
            } else if (this.state.hasMore) {
                // Just hint that there is more.
                statusEl = (<Loading variant="circle" className={classes.endStatusIndicator}/>)
            }
        }

        return (
            <div className={classes.root}>

                <Grid container justify="center" spacing={40}>
                        <Grid item>
                            <MasonryInfiniteScroller
                                hasMore={this.state.hasMore}
                                loadMore={this.loadMoreContent.bind(this)}
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
                                    this.state.elements.map(pepe => (
                                        <div key={pepe.pepeId} className={classes.itemContainer}>
                                            <PepeGridItem pepe={pepe}/>
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


PepeGridInfinite.propTypes = {
    classes: PropTypes.object.isRequired,
    getQuery: PropTypes.func.isRequired
};

export default withStyles(styles)(PepeGridInfinite);