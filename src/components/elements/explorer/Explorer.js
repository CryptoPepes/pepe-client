import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import PepeGridInfinite from "../grid/PepeGridInfinite";
import {
    Divider
} from "@material-ui/core";
import {Query} from "../../../api/query_helper";
import FilterBar from "./FilterBar";
import { withRouter } from 'react-router'
import TabBar from "./TabBar";

const cardWidth = 240;

const styles = theme => ({
    root: {
        width: '100%',
        minHeight: 800
    },
    topSection: {
        /* Center the top section */
        marginLeft: "auto",
        marginRight: "auto",
        /* Match the same width of the infinite grid, but expand on smaller sizes */
        width: '100%',
        [theme.breakpoints.only('sm')]: {
            paddingLeft: 4 * theme.spacing.unit,
            paddingRight: 4 * theme.spacing.unit
        },
        [theme.breakpoints.only('md')]: {
            paddingLeft: 6 * theme.spacing.unit,
            paddingRight: 6 * theme.spacing.unit
        },
        [theme.breakpoints.only('lg')]: {
            width: 4 * (cardWidth + 16)
        },
        [theme.breakpoints.only('xl')]: {
            width: 5 * (cardWidth + 16)
        },
    },
    bar: {
        paddingLeft: 30,
        paddingRight: 30,
    },
    grow: {
        flex: '1 1 auto',
    }
});

class Explorer extends Component {

    constructor(props){
        super(props);

        this.state = {
            query: props.filter || Query.buildQuery({}),
        };
    }


    getQuery = () => this.state.query;

    fire = () => {
        let q = this.getQuery();
        const qId = q.toURLParamStr();

        console.log(this.props);

        history.pushState({}, "", this.props.location.pathname + qId);

        this.setState({queryId: qId});

        console.log("Reloaded grid because of a query change!")
    };

    render() {
        const {classes, topContent} = this.props;

        return (
            <div className={classes.root}>

                <div className={classes.topSection}>
                    {topContent}

                    <FilterBar className={classes.bar} getQuery={this.getQuery} fire={this.fire}/>

                    <TabBar className={classes.bar} getQuery={this.getQuery} fire={this.fire}/>
                </div>

                <Divider/>

                <PepeGridInfinite getQuery={this.getQuery} key={this.state.queryId}/>
            </div>

        );
    }
}

Explorer.propTypes = {
    classes: PropTypes.object.isRequired,
    filter: PropTypes.object,
    perPage: PropTypes.number.isRequired,
    topContent: PropTypes.element
};

export default withRouter(withStyles(styles)(Explorer))
