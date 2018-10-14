import React from "react";
import {
    Card, CardActions, CardContent, CardMedia, IconButton,
    Typography
} from "@material-ui/core";
// import ShareIcon from '@material-ui/icons/Share';
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import AppStyle from "../../../style.scss";
import {Link} from "react-router-dom";
import CozyChip from "../status/CozyChip";
import SaleChip from "../status/SaleChip";
import {connect} from "react-redux";
import {TagHeart} from "mdi-material-ui";
import BreederAddMenu from "../actions/breeder/BreederAddMenu";
import {findDOMNode} from "react-dom";
import {hasAccount} from "../../../util/web3AccountsUtil";

const styles = theme => ({
    card: {
        width: 240,
    },
    mediaLayers: {
        position: "relative"
    },
    media: {
        height: 220,
        backgroundColor: theme.palette.type === "light" ? "#bbb" : "#444",
    },
    mediaOverlay: {
        position: "absolute",
        top: theme.spacing.unit * 2,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    cardContent: {
        padding: "14px 10px 0 10px",
    },
    cardContentInner: {
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        height: 42,
    },
    cardData: {
        margin: theme.spacing.unit,
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    flexGrow: {
        flex: '1 1 auto',
    },
    breedSelectedIcon: {
        color: theme.palette.primary.main,
    }
});

class PepeGridItem extends React.Component {

    constructor() {
        super();

        this.state = {
            breederMenuOpen: false,
            breederMenuAnchorEl: null,
        };
    }

    breederMenuButton = null;

    closeBreederMenu = () => {
        this.setState({
            breederMenuOpen: false
        });
    };

    handleBreederMenuOpen = () => {
        this.setState({
            breederMenuOpen: true,
            breederMenuAnchorEl: findDOMNode(this.breederMenuButton),
        });
    };

    //TODO hover effect on card media

    render() {
        const { classes, pepe, hasWeb3, wallet, breeder } = this.props;

        let nameEl;
        if (pepe.name !== null) {
            nameEl = (<strong>{pepe.name}</strong>)
        } else {
            nameEl = (<span>#{pepe.pepeId}<Typography variant="caption" component="i">(Not named)</Typography></span>)
        }

        // Check if the pepe is being auctioned, and format the prices if so.
        const isForCozy = pepe.cozy_auction !== undefined && !pepe.cozy_auction.isExpired();
        const cozyPrice = isForCozy ? pepe.cozy_auction.getCurrentPrice() : undefined;
        const isForSale = pepe.sale_auction !== undefined && !pepe.sale_auction.isExpired();
        const salePrice = isForSale ? pepe.sale_auction.getCurrentPrice() : undefined;

        const isOwned = hasWeb3 && hasAccount(wallet, pepe.master);


        const isBreedable = isOwned || (hasWeb3 && isForCozy);

        const alreadySelectedMother = !!breeder.motherPepeId;
        const alreadySelectedFather = !!breeder.fatherPepeId;
        const alreadySelectedSelfAsMother = alreadySelectedMother && (breeder.motherPepeId === pepe.pepeId);
        const alreadySelectedSelftAsFather = alreadySelectedFather && (breeder.fatherPepeId === pepe.pepeId);
        const alreadySelectedSelf = alreadySelectedSelfAsMother || alreadySelectedSelftAsFather;

        return (
            <Card className={classes.card}>
                <Link to={"/pepe/"+pepe.pepeId}>
                    <div className={classes.mediaLayers}>
                        <CardMedia
                            className={classes.media}
                            image={pepe.svgPath || "/img/pepe-not-found.png" /* TODO not-found Pepe image */ }
                            title={pepe.name} />
                        <div className={classes.mediaOverlay}>
                            { isForCozy && <CozyChip auctionPrice={cozyPrice}/> }
                            { isForSale && <SaleChip auctionPrice={salePrice}/> }
                        </div>
                    </div>
                </Link>
                <CardContent className={classes.cardContent}>
                    <Link to={"/pepe/"+pepe.pepeId} className={AppStyle.noDeco}>
                        <Typography variant="title" component="h2" className={classes.cardContentInner}>
                            {nameEl}
                        </Typography>
                    </Link>
                </CardContent>
                <CardActions disableActionSpacing>
                    <Typography variant="subheading" component="span" className={classes.cardData}>
                        Gen {pepe.gen}
                    </Typography>
                    <Typography variant="subheading" component="span" className={classes.cardData}>
                        #{pepe.pepeId}
                    </Typography>
                    <div className={classes.flexGrow} />

                    { /* The user must be either the owner,
                            or have it must be an auction, with web3 on. */ }
                    { isBreedable &&
                        <IconButton aria-label="Cozy"
                                    onClick={this.handleBreederMenuOpen}
                                    className={alreadySelectedSelf ? classes.breedSelectedIcon : null}
                                    ref={node => {
                                        this.breederMenuButton = node;
                                    }}>
                            <TagHeart/>
                        </IconButton>
                    }

                    {/*<IconButton aria-label="Share">*/}
                        {/*<ShareIcon />*/}
                    {/*</IconButton>*/}

                    { isBreedable &&
                        <BreederAddMenu open={this.state.breederMenuOpen}
                                        onClose={this.closeBreederMenu}
                                        anchorDomEl={this.state.breederMenuAnchorEl}
                                        pepe={pepe}/>
                    }
                </CardActions>
            </Card>
        )
    }

}

PepeGridItem.propTypes = {
    classes: PropTypes.object.isRequired,
    pepe: PropTypes.object
};

const ConnectedPepeGridItem = connect(state => ({
    breeder: state.breeder,
    hasWeb3: state.web3.hasWeb3,
    wallet: state.redapp.tracking.accounts.wallet
}))(PepeGridItem);

export default withStyles(styles)(ConnectedPepeGridItem);
