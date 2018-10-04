import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {Button} from "@material-ui/core";
import { connect } from 'react-redux';
import TransferDialog from "../actions/TransferDialog";
import GiveNameDialog from "../actions/GiveNameDialog";
import PepeSellDialog from "../actions/auction-maker/PepeSellDialog";
import CozySellDialog from "../actions/auction-maker/CozySellDialog";
import {hasAccount} from "../../../util/web3AccountsUtil";
import SavePepeDialog from "../actions/SavePepeDialog";

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
            "open_save_pepe_sale": false
        }
    }

    handleDialogBtn = (dialogId, open) => () => {
        this.setState({
            [dialogId]: open
        });
    };

    render(){
        const { classes, pepe, hasWeb3, wallet } = this.props;

        // Check explicitly, "false" doesn't count.
        const nameable = pepe.name === null || pepe.name === undefined || pepe.name === "";


        // Check if the pepe is being auctioned, and format the prices if so.
        const isInCozyAuction = pepe.cozy_auction !== undefined;
        const cozyAuctionExpired = isInCozyAuction && pepe.cozy_auction.isExpired();
        const isInSaleAuction = pepe.sale_auction !== undefined;
        const saleAuctionExpired = isInSaleAuction && pepe.sale_auction.isExpired();

        const canStartAuction = !isInSaleAuction && !isInCozyAuction;

        // in the literal sense, some actions can only be executed if the pepe is in the main contract.
        const isOwned = hasWeb3 &&  hasAccount(wallet, pepe.master);

        const isCozyOwner = isInCozyAuction && hasWeb3 && hasAccount(wallet, pepe.cozy_auction.seller);
        const isSaleOwner = isInSaleAuction && hasWeb3 && hasAccount(wallet, pepe.sale_auction.seller);

        return (
            <div>
                {isOwned && <Button variant="raised" color="secondary" className={classes.button}
                        onClick={this.handleDialogBtn("open_transfer", true)}>
                                Transfer
                            </Button>
                }
                {isOwned && <TransferDialog
                    onClose={this.handleDialogBtn("open_transfer", false)}
                    pepe={pepe} open={this.state["open_transfer"]}/>}

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
                    pepe={pepe} open={this.state["open_givename"]}/> }


                {isOwned && canStartAuction && <Button variant="raised" color="secondary" className={classes.button}
                        onClick={this.handleDialogBtn("open_sell", true)}>
                                Sell Pepe
                            </Button>
                }
                {isOwned && canStartAuction && <PepeSellDialog
                    onClose={this.handleDialogBtn("open_sell", false)}
                    pepe={pepe} open={this.state["open_sell"]}/>
                }

                {isOwned && canStartAuction &&
                    <Button variant="raised" color="secondary" className={classes.button}
                            onClick={this.handleDialogBtn("open_cozy", true)}>
                        Start cozy time
                    </Button>
                }
                {isOwned && canStartAuction && <CozySellDialog
                    onClose={this.handleDialogBtn("open_cozy", false)}
                    pepe={pepe} open={this.state["open_cozy"]}/>
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
                        pepe={pepe} open={this.state["open_save_pepe_cozy"]}
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
                    pepe={pepe} open={this.state["open_save_pepe_sale"]}
                    auctionType="sale"/>
                }
            </div>
        )
    }

}

PepeActions.propTypes = {
    classes: PropTypes.object.isRequired,
    pepe: PropTypes.object.isRequired,
};


const styledPepeActions = withStyles(styles)(PepeActions);

export default connect(state => ({
    hasWeb3: state.hasWeb3,
    wallet: state.redapp.tracking.accounts.wallet
}))(styledPepeActions);
