import React from 'react';
import {withStyles} from "@material-ui/core/styles";
import {
    Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, Grid, Hidden, IconButton
} from "@material-ui/core";
import {connect} from 'react-redux';
import breederActionTypes from "../../reducers/breeder/breederActionTypes";
import CloseIcon from '@material-ui/icons/Close';
import {SwapHorizontal, SwapVertical} from "mdi-material-ui";
import PepeAPI from "../../api/api";
import makeCancelable from "makecancelable";
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

    constructor(props) {
        super();

        this.state = {
            fatherPepe: undefined,
            motherPepe: undefined,
            isLoadingFather: !!props.fatherPepeId,
            isLoadingMother: !!props.motherPepeId,
            errorFather: null,
            errorMother: null,
        }
    }

    loader = (pepeId) => PepeAPI.getPepeData(pepeId);

    componentDidMount() {

        if (!!this.props.fatherPepeId) {
            this.reloadFather();
        }

        if (!!this.props.motherPepeId) {
            this.reloadMother();
        }
    }

    reloadFather() {
        if (!this.props.fatherPepeId) {
            this.setState({
                fatherPepe: undefined,
                isLoadingFather: false,
                errorFather: null
            });
        } else {
            this.cancelLoadingFather = makeCancelable(
                    this.loader(this.props.fatherPepeId),
                data => this.setState({
                    fatherPepe: data,
                    errorFather: undefined,
                    isLoadingFather: false
                }),
                error => this.setState({
                    fatherPepe: undefined,
                    errorFather: error,
                    isLoadingFather: false
                })
            );
        }
    }

    reloadMother() {
        if (!this.props.motherPepeId) {
            this.setState({
                motherPepe: undefined,
                isLoadingMother: false,
                errorMother: null
            });
        } else {
            this.cancelLoadingMother = makeCancelable(
                    this.loader(this.props.motherPepeId),
                data => this.setState({
                    motherPepe: data,
                    errorMother: undefined,
                    isLoadingMother: false
                }),
                error => this.setState({
                    motherPepe: undefined,
                    errorMother: error,
                    isLoadingMother: false
                })
            );
        }
    };

    componentDidUpdate(prevProps, prevState, snap) {
        if (prevProps.motherPepeId !== this.props.motherPepeId) {
            if (!!this.cancelLoadingMother) this.cancelLoadingMother();
            this.reloadMother();
        }
        if (prevProps.fatherPepeId !== this.props.fatherPepeId) {
            if (!!this.cancelLoadingFather) this.cancelLoadingFather();
            this.reloadFather();
        }
    }

    componentWillUnmount() {
        if(!!this.cancelLoadingFather) this.cancelLoadingFather();
        if(!!this.cancelLoadingMother) this.cancelLoadingMother();
    }

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
        const {classes, openDrawer} = this.props;

        const {motherPepe, fatherPepe, isLoadingFather, isLoadingMother, errorMother, errorFather} = this.state;

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
                                    <BreederPepeListing pepe={motherPepe}
                                                        title="Mother"
                                                        textName="mother"
                                                        isError={!!errorMother}
                                                        isLoading={isLoadingMother}
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
                                    <BreederPepeListing pepe={fatherPepe}
                                                        title="Father"
                                                        textName="father"
                                                        isError={!!errorFather}
                                                        isLoading={isLoadingFather}
                                                        handleRemovePepe={this.handleRemovePepe("father")}/>
                                </Grid>

                                <Grid xs={12} className={classes.columnCenterAlign} item>
                                    <BreederFinal motherPepe={motherPepe} fatherPepe={fatherPepe}/>
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

