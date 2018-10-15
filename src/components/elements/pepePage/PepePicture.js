import React from "react";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import PepeAPI from "../../../api/api";

const styles = (theme) => ({
    root: {
        width: "100%"
    },
    media: {
        height: "100%",
        display: "block",
        margin: "0 auto 0 auto",
        backgroundColor: "#aaa"
    }
});


class PepePicture extends React.Component {

    render() {
        const {pepeId, classes} = this.props;

        return (
            <div className={classes.root}>
                {pepeId &&
                <img className={classes.media}
                     src={PepeAPI.getPepeSvgSrc(pepeId)}
                     title={"Pepe #" + pepeId}/>
                }
            </div>
        );
    }
}

PepePicture.propTypes = {
    pepeId: PropTypes.string
};

export default withStyles(styles)(PepePicture);
