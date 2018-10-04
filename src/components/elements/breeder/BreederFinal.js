import React from 'react';
import {withStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import {Heart} from "mdi-material-ui";
import CozyBuyDialog from "../actions/auction-taker/CozyBuyDialog";
import BreedDialog from "../actions/breeder/BreedDialog";
import ReporterContent from "../reporting/ReporterContent";
import PropTypes from "prop-types";

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

        const {motherPepe, fatherPepe, classes} = this.props;

        const fatherIsAuctioned = !!fatherPepe && !!fatherPepe.cozy_auction;
        const motherIsAuctioned = !!motherPepe && !!motherPepe.cozy_auction;

        // Cannot take two pepes from 2 cozy auctions and breed them.
        // You must own at least 1 to be able to breed.
        const doubleAuction = fatherIsAuctioned && motherIsAuctioned;

        const isUsingAuction = fatherIsAuctioned || motherIsAuctioned;
        const breedDialog = (doubleAuction || !motherPepe || !fatherPepe)
            ? null : (isUsingAuction
                ? (
                    <CozyBuyDialog
                        onClose={this.handleBreedBtn(false)}
                        motherPepe={motherPepe}
                        fatherPepe={fatherPepe}
                        cozyCandidateAsFather={motherIsAuctioned}
                        open={this.state.breedDialogOpen}/>
                )
                : (
                    <BreedDialog
                        onClose={this.handleBreedBtn(false)}
                        motherPepe={motherPepe}
                        fatherPepe={fatherPepe}
                        open={this.state.breedDialogOpen}/>
                ));

        const isIllegal =
            (!!fatherPepe && !!motherPepe) // If we have a mother and a father
            && ( // and there is an illegal combination
                // require both mother parents not to be the father
                (motherPepe.father === fatherPepe.pepeId)
                || (motherPepe.mother === fatherPepe.pepeId)
                // require both father parents not to be the mother
                || (fatherPepe.father === motherPepe.pepeId)
                || (fatherPepe.mother === motherPepe.pepeId)
            );

        return (
            <div>
                <Button disabled={
                    // Need 2 pepes,
                    //  but they can't both be from an auction,
                    //  and breeding them must be legal
                    doubleAuction
                    || !motherPepe
                    || !fatherPepe
                    || isIllegal
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

                {breedDialog}
            </div>
        )
    }
}

BreederFinal.propTypes = {
    motherPepe: PropTypes.shape({
        name: PropTypes.string,
        pepeId: PropTypes.string.isRequired,
        cozy_auction: PropTypes.object,
        mother: PropTypes.string,
        father: PropTypes.string
    }),
    fatherPepe: PropTypes.shape({
        name: PropTypes.string,
        pepeId: PropTypes.string.isRequired,
        cozy_auction: PropTypes.object,
        mother: PropTypes.string,
        father: PropTypes.string
    })
};

export default withStyles(styles)(BreederFinal);
