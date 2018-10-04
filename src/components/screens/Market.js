import React, { Component } from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import Explorer from "../elements/explorer/Explorer";
import {Query} from "../../api/query_helper";
import {Store} from "@material-ui/icons";
import {Typography} from "@material-ui/core";

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        backgroundColor: theme.palette.background.paper,
    },
    top: {
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
    },
    topIcon: {
        width: "3rem",
        height: "3rem",
        margin: theme.spacing.unit * 2,
        verticalAlign: "middle"
    },
    topTitle: {
        ...theme.typography.display3,
        fontSize: "3rem",
        verticalAlign: "middle"
    }
});

class Market extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const { classes } = this.props;


        let presetQuery;
        if(!this.props.location.search) {
            presetQuery = Query.buildQuery({  });
        }
        else {
            presetQuery = Query.queryStringToQuery(this.props.location.search);
        }

        const top = (
            <div className={classes.top}>
                <h1 className={classes.topTitle}>
                    <Store className={classes.topIcon} /> <span>Marketplace</span>
                </h1>
            </div>
        );

        return (
            <div className={classes.root}>

                <Explorer topContent={top} filter={presetQuery} perPage={15}/>

            </div>
        );
    }

}

Market.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Market);


