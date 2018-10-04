import React from "react";
import {Typography, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import QueryTextual from "../../../api/query_textual";
import {Eye, Tilde, ContentCut, TshirtCrew, Tie, Glasses} from "mdi-material-ui";

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
    const {look, classes} = props;

    // TODO also view the colors (square colored using the hex color in look data)
    return (

        <div className={classes.root}>
            <List component="nav" dense>
                <ListItem>
                    <ListItemIcon>
                        <img alt="Eyes" src="/img/attributes/eyes.svg" className={classes.attributeIcon}/>
                    </ListItemIcon>
                    <ListItemText primary={QueryTextual.getPropertyNameById(look.head.eyes.type) || "none"} secondary="Eyes"/>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <img alt="Mouth" src="/img/attributes/mouth.svg" className={classes.attributeIcon}/>
                    </ListItemIcon>
                    <ListItemText primary={QueryTextual.getPropertyNameById(look.head.mouth) || "none"} secondary="Mouth"/>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <img alt="Hair" src="/img/attributes/hair.svg" className={classes.attributeIcon}/>
                    </ListItemIcon>
                    <ListItemText primary={QueryTextual.getPropertyNameById(look.head.hair.type) || "none"} secondary="Hair"/>
                </ListItem>
            </List>
            <List component="nav" dense>
                <ListItem>
                    <ListItemIcon>
                        <img alt="Shirt" src="/img/attributes/shirt.svg" className={classes.attributeIcon}/>
                    </ListItemIcon>
                    <ListItemText primary={QueryTextual.getPropertyNameById(look.body.shirt.type) || "none"} secondary="Shirt"/>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <img alt="Neck" src="/img/attributes/neck.svg" className={classes.attributeIcon}/>
                    </ListItemIcon>
                    <ListItemText primary={QueryTextual.getPropertyNameById(look.body.neck) || "none"} secondary="Neck"/>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <img alt="Glasses" src="/img/attributes/sunglasses.svg" className={classes.attributeIcon}/>
                    </ListItemIcon>
                    <ListItemText primary={QueryTextual.getPropertyNameById(look.extra.glasses.type) || "none"} secondary="Glasses"/>
                </ListItem>
            </List>
        </div>
    );
};

PepeAttributes.propTypes = {
    look: PropTypes.object.isRequired
};

export default withStyles(styles)(PepeAttributes);
