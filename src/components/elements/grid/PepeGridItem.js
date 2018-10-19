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
import {cozyAddr, saleAddr} from "../../../web3Settings";
import PepePicture from "../pepePage/PepePicture";

const styles = theme => ({
    card: {
        width: 240,
    },
    mediaLayers: {
        position: "relative"
    },
    media: {
        height: 240,
        width: 240,
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
    cardActions: {
        height: 64
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
        const { classes, pepeData, pepeId, hasWeb3, wallet, breeder } = this.props;

        const pepe = pepeData.pepe;
        const isLoading = pepeData.status !== "ok";

        let nameEl;
        if (isLoading) {
            nameEl = (<span>#{pepeId}<Typography variant="caption" component="i">(Loading name)</Typography></span>)
        } else if (pepe.name !== null) {
            nameEl = (<strong>{pepe.name}</strong>)
        } else {
            nameEl = (<span>#{pepeId}<Typography variant="caption" component="i">(Not named)</Typography></span>)
        }

        // Check if the pepe is being auctioned
        const isForCozy = !isLoading && (pepe.master === cozyAddr);
        const isForSale = !isLoading && (pepe.master === saleAddr);

        const isOwned = !isLoading && hasWeb3 && hasAccount(wallet, pepe.master);

        const isBreedable = isOwned || (hasWeb3 && isForCozy);

        const alreadySelectedMother = !!breeder.motherPepeId;
        const alreadySelectedFather = !!breeder.fatherPepeId;
        const alreadySelectedSelfAsMother = alreadySelectedMother && (breeder.motherPepeId === pepeId);
        const alreadySelectedSelftAsFather = alreadySelectedFather && (breeder.fatherPepeId === pepeId);
        const alreadySelectedSelf = alreadySelectedSelfAsMother || alreadySelectedSelftAsFather;

        return (
            <Card className={classes.card}>
                <Link to={"/pepe/"+pepeId}>
                    <div className={classes.mediaLayers}>
                        <div className={classes.media}>
                            <PepePicture pepeId={pepeId}/>
                        </div>
                        <div className={classes.mediaOverlay}>
                            { isForCozy && <CozyChip pepeId={pepeId}/> }
                            { isForSale && <SaleChip pepeId={pepeId}/> }
                        </div>
                    </div>
                </Link>
                <CardContent className={classes.cardContent}>
                    <Link to={"/pepe/"+pepeId} className={AppStyle.noDeco}>
                        <Typography variant="title" component="h2" className={classes.cardContentInner}>
                            {nameEl}
                        </Typography>
                    </Link>
                </CardContent>
                <CardActions disableActionSpacing className={classes.cardActions}>
                    <Typography variant="subheading" component="span" className={classes.cardData}>
                        Gen {isLoading ? "?" : pepe.gen}
                    </Typography>
                    <Typography variant="subheading" component="span" className={classes.cardData}>
                        #{pepeId}
                    </Typography>
                    <div className={classes.flexGrow} />

                    { /* The user must be either the owner,
                            or have it must be an auction, with web3 on. */ }
                    { isBreedable &&
                        <IconButton aria-label="Hop"
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
                                        pepeId={pepeId}/>
                    }
                </CardActions>
            </Card>
        )
    }

}

const StyledPepeGridItem = withStyles(styles)(PepeGridItem);

const ConnectedPepeGridItem = connect((state, props) => ({
    breeder: state.breeder,
    hasWeb3: state.web3.hasWeb3,
    wallet: state.redapp.tracking.accounts.wallet,
    pepeData: (state.pepe.pepes[props.pepeId] && (state.pepe.pepes[props.pepeId].web3 || state.pepe.pepes[props.pepeId].api)) || {}
}))(StyledPepeGridItem);

ConnectedPepeGridItem.propTypes = {
    pepeId: PropTypes.string.isRequired
};

export default ConnectedPepeGridItem;
