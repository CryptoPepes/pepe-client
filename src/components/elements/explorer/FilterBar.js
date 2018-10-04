import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import CooldownFilter from "./filter-bar/CooldownFilter";
import NameFilter from "./filter-bar/NameFilter";
import PropsFilter from "./filter-bar/PropsFilter";
import GenFilter from "./filter-bar/GenFilter";
import QueryChanger from "./QueryChanger";
import SearchBtn from "./filter-bar/SearchBtn";

const styles = theme => ({
    grow: {
        flex: '1 1 auto',
    },
    filterBar: {
        padding: 30,
    },
    filterBox: {
        minHeight: 100,
    }
});

class FilterBar extends QueryChanger {

    render() {

        const {classes} = this.props;

        // TODO: Disabled for now, fuzzy name search has to be implemented well first.
        // const nameSearchEl = (<NameFilter getQuery={this.getQuery}/>);
        const phenoPropSelectel = (<PropsFilter getQuery={this.getQuery}/>);
        const filterGenEl = (<GenFilter getQuery={this.getQuery}/>);
        const filterCooldownEl = (<CooldownFilter getQuery={this.getQuery}/>);

        const searchBtnEl = ( <SearchBtn getQuery={this.getQuery} fire={this.fire}/>);

        return (
            <Grid container spacing={24} className={classes.filterBar} justify="center">
                <Grid item xs={12} sm={6} md={3} className={classes.filterBox}>
                    { phenoPropSelectel }
                </Grid>
                <Grid item xs={6} sm={3} md={2} className={classes.filterBox}>
                    { filterGenEl }
                </Grid>
                <Grid item xs={6} sm={3} md={2} className={classes.filterBox}>
                    { filterCooldownEl }
                </Grid>
                <Grid item xs={6} sm={3} md={2} className={classes.filterBox}>
                    { searchBtnEl }
                </Grid>

            </Grid>
        )
    }
}

FilterBar.propTypes = {
    classes: PropTypes.object.isRequired,
    getQuery: PropTypes.func.isRequired,
    fire: PropTypes.func.isRequired
};

export default withStyles(styles)(FilterBar);