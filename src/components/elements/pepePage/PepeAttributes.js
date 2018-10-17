import React from "react";
import {List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import QueryTextual from "../../../api/query_textual";
import connect from "react-redux/es/connect/connect";

const styles = (theme) => ({
    root: {
        [theme.breakpoints.up('sm')]: {
            display: "flex",
            justifyContent: "space-evenly",
            flexDirection: "row"
        }
    },
    attributeIcon: {
      width: 24
    }
});


const PepeAttributes = (props) => {
    const {lookData, classes} = props;

    const look = lookData.look;
    const lookIsLoading = lookData.status === "getting";

    // TODO also view the colors (square colored using the hex color in look data)
    return (

        <div className={classes.root}>
            <List component="nav" dense>
                <ListItem>
                    <ListItemIcon>
                        <img alt="Eyes" src="/img/attributes/eyes.svg" className={classes.attributeIcon}/>
                    </ListItemIcon>
                    <ListItemText primary={lookIsLoading ? "..." : QueryTextual.getPropertyNameById(look.head.eyes.type) || "none"} secondary="Eyes"/>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <img alt="Mouth" src="/img/attributes/mouth.svg" className={classes.attributeIcon}/>
                    </ListItemIcon>
                    <ListItemText primary={lookIsLoading ? "..." : QueryTextual.getPropertyNameById(look.head.mouth) || "none"} secondary="Mouth"/>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <img alt="Hair" src="/img/attributes/hair.svg" className={classes.attributeIcon}/>
                    </ListItemIcon>
                    <ListItemText primary={lookIsLoading ? "..." : QueryTextual.getPropertyNameById(look.head.hair.type) || "none"} secondary="Hair"/>
                </ListItem>
            </List>
            <List component="nav" dense>
                <ListItem>
                    <ListItemIcon>
                        <img alt="Shirt" src="/img/attributes/shirt.svg" className={classes.attributeIcon}/>
                    </ListItemIcon>
                    <ListItemText primary={lookIsLoading ? "..." : QueryTextual.getPropertyNameById(look.body.shirt.type) || "none"} secondary="Shirt"/>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <img alt="Neck" src="/img/attributes/neck.svg" className={classes.attributeIcon}/>
                    </ListItemIcon>
                    <ListItemText primary={lookIsLoading ? "..." : QueryTextual.getPropertyNameById(look.body.neck) || "none"} secondary="Neck"/>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <img alt="Glasses" src="/img/attributes/sunglasses.svg" className={classes.attributeIcon}/>
                    </ListItemIcon>
                    <ListItemText primary={lookIsLoading ? "..." : QueryTextual.getPropertyNameById(look.extra.glasses.type) || "none"} secondary="Glasses"/>
                </ListItem>
            </List>
        </div>
    );
};

const StyledPepeAttributes = withStyles(styles)(PepeAttributes);


const ConnectedPepeAttributes = connect((state, props) => ({
    lookData: (state.pepe.lookData[props.pepeId] && (state.pepe.lookData[props.pepeId].web3 || state.pepe.lookData[props.pepeId].api)) || {}
}))(StyledPepeAttributes);


export default ConnectedPepeAttributes;
