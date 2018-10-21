import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import PepeGridItem from "./PepeGridItem";
import {Grid} from "@material-ui/core";

const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing.unit
    }
});

class PepeGrid extends Component {

    render() {
        const { classes, items, ...otherProps } = this.props;

        return (
            <div className={classes.root}>
                <Grid container spacing={40} {...otherProps}>
                    {(items || []).map((v, i) => (
                        <Grid key={"pepe-"+i} item>
                            <PepeGridItem pepeId={v}/>
                        </Grid>
                    ))}
                </Grid>
            </div>
        )
    }
}


PepeGrid.propTypes = {
    classes: PropTypes.object.isRequired,
    // Array of pepeIds
    items: PropTypes.arrayOf(PropTypes.string)
};

export default withStyles(styles)(PepeGrid);