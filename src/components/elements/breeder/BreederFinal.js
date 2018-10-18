import React from 'react';
import {withStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import {Heart} from "mdi-material-ui";
import CozyBuyDialog from "../actions/auction-taker/CozyBuyDialog";
import BreedDialog from "../actions/breeder/BreedDialog";
import ReporterContent from "../reporting/ReporterContent";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import {cozyAddr} from "../../../web3Settings";

const styles = theme => ({
    cozyBtnIcon: {
        marginLeft: theme.spacing.unit,
    }
});

class BreederFinal extends React.Component {

    constructor() {
        super();
        this.state = {
            breedDialogOpen: false
        }
    }

    handleBreedBtn = (open) => () => {
        this.setState({
            breedDialogOpen: open
        });
    };

    render() {
        const {motherPepeId, fatherPepeId, motherPepeData, fatherPepeData, classes} = this.props;

        const fatherPepe = fatherPepeData.pepe;
        const motherPepe = motherPepeData.pepe;
        const fatherIsAuctioned = fatherPepeData.status === "ok" && fatherPepe.master === cozyAddr;
        const motherIsAuctioned = motherPepeData.status === "ok" && motherPepe.master === cozyAddr;

        // Cannot take two pepes from 2 cozy auctions and breed them.
        // You must own at least 1 to be able to breed.
        const doubleAuction = fatherIsAuctioned && motherIsAuctioned;

        const isUsingAuction = fatherIsAuctioned || motherIsAuctioned;
        const breedDialog = (doubleAuction || !motherPepe || !fatherPepe)
            ? null : (isUsingAuction
                ? (
                    <CozyBuyDialog
                        onClose={this.handleBreedBtn(false)}
                        motherPepeId={motherPepeId}
                        fatherPepeId={fatherPepeId}
                        cozyCandidateAsFather={motherIsAuctioned}
                        open={this.state.breedDialogOpen}/>
                )
                : (
                    <BreedDialog
                        onClose={this.handleBreedBtn(false)}
                        motherPepeId={motherPepeId}
                        fatherPepeId={fatherPepeId}
                        open={this.state.breedDialogOpen}/>
                ));

        const isIllegal =
            (!!fatherPepe && !!motherPepe) // If we have a mother and a father
            && ( // and there is an illegal combination
                // require both mother parents not to be the father
                (motherPepe.father === fatherPepeId)
                || (motherPepe.mother === fatherPepeId)
                // require both father parents not to be the mother
                || (fatherPepe.father === motherPepeId)
                || (fatherPepe.mother === motherPepeId)
            );

        const isError = (fatherPepeData.status === "error" || fatherPepeData.status === "error");
        const isLoading = (fatherPepeData.status === "error" || fatherPepeData.status === "error");
        return (
            <div>
                <Button disabled={
                    isError || isLoading || (
                    // Need 2 pepes,
                    //  but they can't both be from an auction,
                    //  and breeding them must be legal
                    doubleAuction
                    || !motherPepe
                    || !fatherPepe
                    || isIllegal
                    )
                }
                        onClick={this.handleBreedBtn(true)}
                >
                    Start cozy time <Heart className={classes.cozyBtnIcon}/></Button>

                {doubleAuction && <ReporterContent message={
                    <span>Cannot hop, both pepes come from an auction,
                                            at least one needs to be owned.</span>
                } variant="error"/>
                }
                {isIllegal && <ReporterContent message={
                    <span>Cannot hop, pepes are close relatives.</span>
                } variant="error"/>
                }
                {isLoading && <ReporterContent message={
                    <span>Loading pepe data...</span>
                } variant="info"/>
                }
                {isError && <ReporterContent message={
                    <span>Cannot hop, failed to load data for pepes.</span>
                } variant="error"/>
                }

                {breedDialog}
            </div>
        )
    }
}

const StyledBreederFinal = withStyles(styles)(BreederFinal);

const ConnectedBreederFinal = connect((state, props) => {
    const fatherPepeData = state.pepe.pepes[props.fatherPepeId];
    const motherPepeData = state.pepe.pepes[props.motherPepeId];
    return ({
        PepeBase: state.redapp.contracts.PepeBase,
        fatherPepeData: (fatherPepeData && (fatherPepeData.web3 || fatherPepeData.api)) || {},
        motherPepeData: (motherPepeData && (motherPepeData.web3 || motherPepeData.api)) || {}
    });
})(StyledBreederFinal);

ConnectedBreederFinal.propTypes = {
    motherPepeId: PropTypes.string,
    fatherPepeId: PropTypes.string
};

export default ConnectedBreederFinal;
