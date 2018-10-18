import React from "react";
import {Popover} from "@material-ui/core";
import PropTypes from "prop-types";
import {List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {GenderFemale, GenderMale, TagHeart} from "mdi-material-ui";
import breederActionTypes from "../../../../reducers/breeder/breederActionTypes";
import {connect} from "react-redux";
import {Close} from "@material-ui/icons";
import Closeable from "../../util/Closeable";


class BreederAddMenu extends Closeable {

    handleSelect = (selectType, deselect) => () => {
        this.props.dispatch({
            type: selectType === "mother"
                ? breederActionTypes.BREEDER_CHANGE_MOTHER
                : breederActionTypes.BREEDER_CHANGE_FATHER,
            pepeId: deselect ? null : this.props.pepeId
        });
        // Check if this is the 2nd selected pepe, to automatically open the breeder menu
        if ((!!this.props.breeder.motherPepeId && selectType === "father" && !deselect)
            || (!!this.props.breeder.fatherPepeId && selectType === "mother" && !deselect)){
            this.showCozyPlans();
        }
    };

    showCozyPlans = () => {
        if (!this.props.breeder.openDrawer) this.props.dispatch({
            type: breederActionTypes.BREEDER_TOGGLE_DRAWER
        });
    };

    render() {
        const {
            pepeId,
            breeder,
            anchorDomEl
        } = this.props;

        const alreadySelectedMother = !!breeder.motherPepeId;
        const alreadySelectedFather = !!breeder.fatherPepeId;
        const alreadySelectedSelfAsMother = alreadySelectedMother && (breeder.motherPepeId === pepeId);
        const alreadySelectedSelftAsFather = alreadySelectedFather && (breeder.fatherPepeId === pepeId);
        const alreadySelectedSelf = alreadySelectedSelfAsMother || alreadySelectedSelftAsFather;

        let motherText = null;
        let fatherText = null;
        if (alreadySelectedSelf) motherText = "(pepe was already selected)";
        else if (alreadySelectedMother) motherText = "(Replace selected mother)";

        if (alreadySelectedSelf) fatherText = "(pepe was already selected)";
        else if (alreadySelectedFather) fatherText = "(Replace selected father)";

        return (
            <Popover
                open={this.state.isOpen}
                anchorEl={anchorDomEl}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                onClose={this.handleOpen(false)}
            >
                <List component="nav">

                    <ListItem button
                              onClick={this.handleSelect("mother", false)}
                              disabled={alreadySelectedSelf}
                    >
                        <ListItemIcon>
                            <GenderFemale />
                        </ListItemIcon>
                        <ListItemText primary="Select as mother"
                                      secondary={motherText} />
                    </ListItem>

                    <ListItem button
                              onClick={this.handleSelect("father", false)}
                              disabled={alreadySelectedSelf}
                    >
                        <ListItemIcon>
                            <GenderMale />
                        </ListItemIcon>
                        <ListItemText primary="Select as father"
                                      secondary={fatherText} />
                    </ListItem>

                    {alreadySelectedSelf &&
                        <ListItem button
                                  onClick={this.handleSelect(
                                      alreadySelectedSelfAsMother ? "mother" : "father", true)}
                        >
                            <ListItemIcon>
                                <Close />
                            </ListItemIcon>
                            <ListItemText primary="Deselect" />
                        </ListItem>
                    }


                    <ListItem button onClick={this.showCozyPlans}>
                        <ListItemIcon>
                            <TagHeart />
                        </ListItemIcon>
                        <ListItemText primary="Show cozy plans" />
                    </ListItem>

                </List>
            </Popover>
        )
    }
}


BreederAddMenu.propTypes = {
    open: PropTypes.bool,
    pepeId: PropTypes.string,
    onClose: PropTypes.func,
    anchorDomEl: PropTypes.object,
};

const ConnectedBreederAddMenu = connect(state => ({
    breeder: state.breeder
}))(BreederAddMenu);

export default ConnectedBreederAddMenu;
