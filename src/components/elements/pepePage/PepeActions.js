import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {Button, Typography} from "@material-ui/core";
import { connect } from 'react-redux';
import {findDOMNode} from "react-dom";
import TransferDialog from "../actions/TransferDialog";
import GiveNameDialog from "../actions/GiveNameDialog";
import PepeSellDialog from "../actions/auction-maker/PepeSellDialog";
import CozySellDialog from "../actions/auction-maker/CozySellDialog";
import {hasAccount} from "../../../util/web3AccountsUtil";
import SavePepeDialog from "../actions/SavePepeDialog";
import {TagHeart} from "mdi-material-ui";
import BreederAddMenu from "../actions/breeder/BreederAddMenu";
import {AuctionData} from "../../../api/model";
import ReporterContent from "../reporting/ReporterContent";

const styles = theme => ({
    button : {
        marginRight: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    }
});

class PepeActions extends React.Component {

    constructor() {
        super();

        this.state = {
            "open_transfer": false,
            "open_givename": false,
            "open_sell": false,
            "open_cozy": false,
            "open_save_pepe_cozy": false,
            "open_save_pepe_sale": false,
            "open_breeding": false,
            breederMenuAnchorEl: null
        }
    }

    handleDialogBtn = (dialogId, open) => () => {
        this.setState({
            [dialogId]: open
        });
    };

    breederMenuButton = null;

    handleBreederMenuOpen = () => {
        this.setState({
            open_breeding: true,
            breederMenuAnchorEl: findDOMNode(this.breederMenuButton),
        });
    };

    render(){
        const { classes, pepeData, pepeId, saleAuctionData, cozyAuctionData, hasWeb3, wallet, breeder } = this.props;

        if (saleAuctionData.status === "error") {
            console.log("Failed to load sale auction data.");
            // Continue, data will be ignored, as if it was still loading. User can refresh to force new retrieval of data.
        }
        if (cozyAuctionData.status === "error") {
            console.log("Failed to load cozy auction data.");
            // Continue, data will be ignored, as if it was still loading. User can refresh to force new retrieval of data.
        }
        if (pepeData.status === "error") {
            return <ReporterContent message="Could not load pepe data."/>
        }

        const isLoadingSaleAuction = saleAuctionData.status !== "ok";
        const isLoadingCozyAuction = cozyAuctionData.status !== "ok";
        const isLoadingPepe = pepeData.status !== "ok";

        const pepe = pepeData.pepe;

        const nameable = isLoadingPepe ? false : (!pepe.name);

        const cozyAuction = isLoadingSaleAuction ? null : (cozyAuctionData.auction ? new AuctionData(cozyAuctionData.auction) : null);
        const saleAuction = isLoadingCozyAuction ? null : (saleAuctionData.auction ? new AuctionData(saleAuctionData.auction) : null);

        // Check if the pepe is being auctioned, and format the prices if so.
        const isInCozyAuction = !!cozyAuction;
        const cozyAuctionExpired = isInCozyAuction && cozyAuction.isExpired();
        const isInSaleAuction = !!saleAuction;
        const saleAuctionExpired = isInSaleAuction && saleAuction.isExpired();

        const canStartAuction = !isInSaleAuction && !isInCozyAuction;

        // in the literal sense, some actions can only be executed if the pepe is in the main contract.
        const isOwned = !isLoadingPepe && hasWeb3 && hasAccount(wallet, pepe.master);

        const isCozyOwner = isInCozyAuction && hasWeb3 && hasAccount(wallet, cozyAuction.seller);
        const isSaleOwner = isInSaleAuction && hasWeb3 && hasAccount(wallet, saleAuction.seller);

        const isBreedable = isOwned || (hasWeb3 && isInCozyAuction && !cozyAuctionExpired);
        const alreadySelectedMother = !!breeder.motherPepeId;
        const alreadySelectedFather = !!breeder.fatherPepeId;
        const alreadySelectedSelfAsMother = alreadySelectedMother && (breeder.motherPepeId === pepeId);
        const alreadySelectedSelftAsFather = alreadySelectedFather && (breeder.fatherPepeId === pepeId);
        const alreadySelectedSelf = alreadySelectedSelfAsMother || alreadySelectedSelftAsFather;

        return (
            <div>
                {isOwned && <Button variant="raised" color="secondary" className={classes.button}
                        onClick={this.handleDialogBtn("open_transfer", true)}>
                                Transfer
                            </Button>
                }
                {isOwned && <TransferDialog
                    onClose={this.handleDialogBtn("open_transfer", false)}
                    pepeId={pepeId} open={this.state["open_transfer"]}/>}

                {isOwned && (
                    nameable
                        ? <Button variant="raised" color="secondary" className={classes.button}
                                  onClick={this.handleDialogBtn("open_givename", true)}>
                            Give Name
                          </Button>
                        : <Button variant="raised" color="secondary" className={classes.button}
                                  disabled>(Already named)</Button>
                    )
                }
                {isOwned && nameable && <GiveNameDialog
                    onClose={this.handleDialogBtn("open_givename", false)}
                    pepeId={pepeId} open={this.state["open_givename"]}/> }


                {isOwned && canStartAuction && <Button variant="raised" color="secondary" className={classes.button}
                        onClick={this.handleDialogBtn("open_sell", true)}>
                                Sell Pepe
                            </Button>
                }
                {isOwned && canStartAuction && <PepeSellDialog
                    onClose={this.handleDialogBtn("open_sell", false)}
                    pepeId={pepeId} open={this.state["open_sell"]}/>
                }

                {isOwned && canStartAuction &&
                    <Button variant="raised" color="secondary" className={classes.button}
                            onClick={this.handleDialogBtn("open_cozy", true)}>
                        Start cozy time
                    </Button>
                }
                {isOwned && canStartAuction && <CozySellDialog
                    onClose={this.handleDialogBtn("open_cozy", false)}
                    pepeId={pepeId} open={this.state["open_cozy"]}/>
                }

                {isInCozyAuction && cozyAuctionExpired && isCozyOwner &&
                    <Button variant="raised" color="secondary" className={classes.button}
                           onClick={this.handleDialogBtn("open_save_pepe_cozy", true)}>
                        Retrieve from auction
                    </Button>
                }
                {isInCozyAuction && cozyAuctionExpired && isCozyOwner &&
                    <SavePepeDialog
                        onClose={this.handleDialogBtn("open_save_pepe_cozy", false)}
                        pepeId={pepeId} open={this.state["open_save_pepe_cozy"]}
                        auctionType="cozy"/>
                }

                {isInSaleAuction && saleAuctionExpired && isSaleOwner &&
                <Button variant="raised" color="secondary" className={classes.button}
                        onClick={this.handleDialogBtn("open_save_pepe_sale", true)}>
                    Retrieve from auction
                </Button>
                }
                {isInSaleAuction && saleAuctionExpired && isSaleOwner &&
                <SavePepeDialog
                    onClose={this.handleDialogBtn("open_save_pepe_sale", false)}
                    pepeId={pepeId} open={this.state["open_save_pepe_sale"]}
                    auctionType="sale"/>
                }

                { /* The user must be either the owner,
                                or have it must be an auction, with web3 on. */ }
                { isBreedable &&
                <Button aria-label="Cozy"
                        onClick={this.handleBreederMenuOpen}
                        variant={alreadySelectedSelf ? "outlined" : "raised"}
                        color="secondary"
                        ref={node => {
                            this.breederMenuButton = node;
                        }}>
                    {isOwned ? "Hop with other pepe" : "Buy cozy auction"} <TagHeart className={classes.cozyBtnIcon}/>
                </Button>
                }

                { isBreedable &&
                <BreederAddMenu open={this.state["open_breeding"]}
                                onClose={this.handleDialogBtn("open_breeding", false)}
                                anchorDomEl={this.state.breederMenuAnchorEl}
                                pepeId={pepeId}/>
                }
            </div>
        )
    }

}

const StyledPepeActions = withStyles(styles)(PepeActions);

export default connect((state, props) => ({
    breeder: state.breeder,
    hasWeb3: state.web3.hasWeb3,
    wallet: state.redapp.tracking.accounts.wallet,
    pepeData: (state.pepe.pepes[props.pepeId] && (state.pepe.pepes[props.pepeId].web3 || state.pepe.pepes[props.pepeId].api)) || {},
    saleAuctionData: (state.pepe.saleAuctions[props.pepeId] && (state.pepe.saleAuctions[props.pepeId].web3 || state.pepe.saleAuctions[props.pepeId].api)) || {},
    cozyAuctionData: (state.pepe.cozyAuctions[props.pepeId] && (state.pepe.cozyAuctions[props.pepeId].web3 || state.pepe.cozyAuctions[props.pepeId].api)) || {}
}))(StyledPepeActions);
