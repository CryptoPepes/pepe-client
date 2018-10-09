import React from "react";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {
    Button,
    DialogContentText,
    Typography,
    Grid
} from "@material-ui/core";
import {connect} from "react-redux";
import PepeGridItem from "../../grid/PepeGridItem";
import TxDialog from "../TxDialog";
import breederActionTypes from "../../../../reducers/breeder/breederActionTypes";
import ReporterContent from "../../reporting/ReporterContent";

const styles = (theme) => ({
    pepeGridContainer: {
        paddingTop: 20,
        paddingBottom: 20,
        marginLeft: "auto",
        marginRight: "auto"
    },
    errorListItem: {
        margin: theme.spacing.unit
    }
});

class BreedDialog extends React.Component {

    constructor() {
        super();

        this.state = {
            // undefined as long as tx is not sent
            txTrackingId: undefined
        }
    }

    handleTxSend = () => {
        const { PepeBase, motherPepe, fatherPepe, hasWeb3} = this.props;

        if (hasWeb3) {
            const {txID, thunk} = PepeBase.methods.cozyTime.trackedSend(
                {from: motherPepe.master}, motherPepe.pepeId, fatherPepe.pepeId, motherPepe.master
            );

            this.setState({
                txTrackingId: txID,
            });

            this.props.dispatch(thunk);

            // deselect mother/father pepes
            this.props.dispatch({
                type: breederActionTypes.BREEDER_CHANGE_MOTHER,
                pepe: null
            });
            this.props.dispatch({
                type: breederActionTypes.BREEDER_CHANGE_FATHER,
                pepe: null
            });
        }
    };

    render() {
        const {open, onClose, classes, motherPepe, fatherPepe, hasWeb3} = this.props;

        const nowTimestamp = Math.floor(Date.now() / 1000);
        const motherCanCozy = motherPepe.can_cozy_again <= nowTimestamp;
        const fatherCanCozy = fatherPepe.can_cozy_again <= nowTimestamp;

        const sameOwner = motherPepe.master === fatherPepe.master;

        const errorMsgs = [];

        if (!sameOwner) {
            errorMsgs.push(
                <ReporterContent variant="error" message={
                    <p>Pepes are not owned by the same address.
                        <br/>
                        Possible causes:
                        <ul>
                            <li>Data may have changed recently.
                                If so, wait for a change and reload.</li>
                            <li>You are using a multi-account wallet.
                                If so, transfer one of your pepes to the address of the other.</li>
                        </ul>
                    </p>
                }/>
            );
        }

        if (!motherCanCozy) {
            errorMsgs.push(<ReporterContent variant="error" message={
                `Mother pepe (#${motherPepe.pepeId}) has to rest before hopping again.`
            }/>);
        }

        if (!fatherCanCozy) {
            errorMsgs.push(<ReporterContent variant="error" message={
                `Father pepe (#${fatherPepe.pepeId}) has to rest before hopping again.`
            }/>);
        }

        return (
            <TxDialog
                open={open}
                onClose={onClose}
                dialogTitle={<span>Hop'</span>}
                dialogActions={
                    <Button onClick={this.handleTxSend}
                            disabled={!hasWeb3 || !motherCanCozy || !fatherCanCozy || !sameOwner}
                            variant="raised" color="secondary">
                        Hop!
                    </Button>
                }
                txTrackingId={this.state.txTrackingId}
                loadingWeb3={!hasWeb3}
                extra={
                    errorMsgs.length > 0
                        ? <div>
                            {errorMsgs.map((el, i) => (
                                <div className={classes.errorListItem}
                                     key={"error-msg-" + i}>{el}</div>
                            ))}
                        </div>
                        : null
                }
            >
                <DialogContentText>
                    Make pepe #{motherPepe.pepeId} have a cozy time with pepe #{fatherPepe.pepeId}.
                </DialogContentText>
                <div className={classes.pepeGridContainer}>
                    <Grid container justify="center" spacing={40}>
                        <Grid xs={12} sm={6} item>
                            <PepeGridItem pepe={motherPepe}/>
                        </Grid>
                        <Grid xs={12} sm={6} item>
                            <PepeGridItem pepe={fatherPepe}/>
                        </Grid>
                    </Grid>
                </div>
            </TxDialog>
        );
    }

}

BreedDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,

    motherPepe: PropTypes.shape({
        name: PropTypes.string,
        pepeId: PropTypes.string
    }).isRequired,
    fatherPepe: PropTypes.shape({
        name: PropTypes.string,
        pepeId: PropTypes.string
    }).isRequired
};

const styledBreedDialog = withStyles(styles)(BreedDialog);

export default connect(state => ({
    hasWeb3: state.web3.hasWeb3,
    PepeBase: state.redapp.contracts.PepeBase
}))(styledBreedDialog);