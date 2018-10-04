import React from "react";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import PepeAPI from "../../../api/api";

const styles = (theme) => ({
    root: {
        width: "100%",
        minWidth: 300
    },
    media: {
        height: "100%",
        display: "block",
        margin: "0 auto 0 auto"
    }
});


class PepePicture extends React.Component {

    render() {
        const {pepeId, classes} = this.props;

        return (
            <div>
                <img className={classes.media}
                     src={pepeId === undefined ? "/assets/img/pepe-loading.png" : PepeAPI.getPepeSvgSrc(pepeId)}
                     title={pepeId === undefined ? "..." : ("Pepe #" + pepeId)}/>
            </div>
        );
    }
}

PepePicture.propTypes = {
    pepeId: PropTypes.string
};

export default withStyles(styles)(PepePicture);
