import React from "react";
import {withStyles} from "@material-ui/core/styles";

const styles = (theme) => ({
    root: {
        padding: "0 0.8rem 0 0.8rem",
        display: "inline-block",
        verticalAlign: "middle"
    }
});


const Separator = (props) => {
    const {classes} = props;

    return (
        <span className={classes.root}>
            &bull;
        </span>
    );
};

export default withStyles(styles)(Separator);
