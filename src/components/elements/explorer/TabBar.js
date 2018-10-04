import React from "react";
import PropTypes from 'prop-types';
import {withStyles} from "@material-ui/core/styles";
import ListingTypeFilter from "./tab-bar/ListingTypeFilter";
import QueryChanger from "./QueryChanger";

const styles = theme => ({
    root: {
        padding: "0 16px 0 16px",
        marginBottom: 0,
        paddingBottom: 0
    }
});

class TabBar extends QueryChanger {

    constructor(props) {
        super(props);
    }

    render() {

        const {classes} = this.props;

        const tabsEl = (
            <ListingTypeFilter getQuery={this.getQuery}
                               fire={this.fire}/>);

        return (
            <div className={classes.root}>
                {tabsEl}
            </div>
        )
    }
}

TabBar.propTypes = {
    classes: PropTypes.object.isRequired,
    getQuery: PropTypes.func.isRequired,
    fire: PropTypes.func.isRequired
};

export default withStyles(styles)(TabBar);