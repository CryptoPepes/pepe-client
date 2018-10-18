import React from 'react';
import {withStyles} from "@material-ui/core/styles";
import {
    Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, Grid, Hidden, IconButton
} from "@material-ui/core";
import {connect} from 'react-redux';
import breederActionTypes from "../../reducers/breeder/breederActionTypes";
import CloseIcon from '@material-ui/icons/Close';
import {SwapHorizontal, SwapVertical} from "mdi-material-ui";
import BreederPepeListing from "../elements/breeder/BreederPepeListing";
import BreederFinal from "../elements/breeder/BreederFinal";


const styles = theme => ({
    mainList: {
        // Pure black, to contrast with the grey of the pepe cards
        backgroundColor: theme.palette.type === "light" ? "#fff" : "#000",
    },
    pepeGridContainer: {
        padding: 20,
        marginLeft: "auto",
        marginRight: "auto"
    },
    columnCenterAlign: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column"
    }
});

class Breeder extends React.Component {

    handleBreederToggle = () => {
        this.props.dispatch({
            type: breederActionTypes.BREEDER_TOGGLE_DRAWER
        });
    };

    handleRemovePepe = (pepeRole) => () => {
        this.props.dispatch({
            type: pepeRole === "mother"
                ? breederActionTypes.BREEDER_CHANGE_MOTHER
                : breederActionTypes.BREEDER_CHANGE_FATHER,
            pepeId: null
        });
    };

    handleSwapPepes = () => {
        this.props.dispatch({
            type: breederActionTypes.BREEDER_SWAP_PEPES
        });
    };

    render() {
        const {classes, openDrawer, motherPepeId, fatherPepeId} = this.props;

        return (
            <Drawer anchor="bottom" open={openDrawer}
                    disableAutoFocus
                    disableEnforceFocus
                    onClose={this.handleBreederToggle}>
                <List className={classes.mainList}>
                    <ListItem button onClick={this.handleBreederToggle}>
                        <ListItemIcon>
                            <CloseIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Close cozy time plans"/>
                    </ListItem>

                    <Divider/>

                    <ListItem>
                        <div className={classes.pepeGridContainer}>
                            <Grid container justify="center" spacing={40}>
                                <Grid xs={12} sm={5} className={classes.columnCenterAlign} item>
                                    <BreederPepeListing pepeId={motherPepeId}
                                                        title="Mother"
                                                        textName="mother"
                                                        handleRemovePepe={this.handleRemovePepe("mother")}/>
                                </Grid>

                                <Grid xs={12} sm={2} className={classes.columnCenterAlign} item>
                                    <IconButton className={classes.middleIconBtn}
                                                onClick={this.handleSwapPepes}>
                                        <Hidden xsDown>
                                            <SwapHorizontal className={classes.middleIcon}/>
                                        </Hidden>
                                        <Hidden smUp>
                                            <SwapVertical className={classes.middleIcon}/>
                                        </Hidden>
                                    </IconButton>
                                </Grid>

                                <Grid xs={12} sm={5} className={classes.columnCenterAlign} item>
                                    <BreederPepeListing pepeId={fatherPepeId}
                                                        title="Father"
                                                        textName="father"
                                                        handleRemovePepe={this.handleRemovePepe("father")}/>
                                </Grid>

                                <Grid xs={12} className={classes.columnCenterAlign} item>
                                    <BreederFinal motherPepeId={motherPepeId} fatherPepeId={fatherPepeId}/>
                                </Grid>
                            </Grid>
                        </div>
                    </ListItem>
                </List>
            </Drawer>
        );
    }
}

const styledBreeder = withStyles(styles)(Breeder);

const ConnectedBreeder = connect(state => ({
    fatherPepeId: !!state.breeder ? state.breeder.fatherPepeId : undefined,
    motherPepeId: !!state.breeder ? state.breeder.motherPepeId : undefined,
    openDrawer: !!state.breeder ? state.breeder.openDrawer : false,
}))(styledBreeder);


export default ConnectedBreeder;

