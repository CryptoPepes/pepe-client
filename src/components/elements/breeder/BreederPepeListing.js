import React from 'react';
import {withStyles} from "@material-ui/core/styles";
import {IconButton} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import PepeGridItem from "../grid/PepeGridItem";
import PropTypes from "prop-types";

const styles = theme => ({
    noSelectionText: {
        ...theme.typography.body1,
        color: theme.palette.type === "light" ? "#444" : "#bbb",
        margin: theme.spacing * 2
    },
    pepeTitle: {
        ...theme.typography.title,
        fontSize: 32,
        padding: 2 * theme.spacing.unit,
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    },
    removeBtn: {
        padding: 6,
        width: 32,
        height: 32
    },
    removeBtnIcon: {
        fontSize: 20
    },
    middleIcon: {
        ...theme.typography.title,
        fontSize: 32
    },
    middleIconBtn: {
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        height: 32 + 4 * theme.spacing.unit,
        width: 32 + 4 * theme.spacing.unit,
        padding: 2 * theme.spacing.unit
    }
});

class BreederPepeListing extends React.Component {

    render() {
        const {pepeId, title, textName, handleRemovePepe, classes} = this.props;

        return (
            <div>
                <div className={classes.pepeTitle}>
                    <span>{title}</span>
                    <IconButton className={classes.removeBtn} onClick={handleRemovePepe}>
                        <CloseIcon className={classes.removeBtnIcon}/>
                    </IconButton>
                </div>
                {
                    pepeId
                    ? <PepeGridItem pepeId={pepeId}/>
                    : <span className={classes.noSelectionText}>No {textName} selected.</span>
                }
            </div>
        )
    }
}

BreederPepeListing.propTypes = {
    pepId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    textName: PropTypes.string.isRequired,
    handleRemovePepe: PropTypes.func.isRequired
};


export default withStyles(styles)(BreederPepeListing);

