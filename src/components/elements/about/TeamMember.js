import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {Typography, Button, Card, CardMedia, CardContent, CardActions, Grid} from "@material-ui/core";
import PropTypes from "prop-types";

const styles = theme => ({
    card: {
      background: theme.palette.type === 'light' ? '' : theme.palette.background.default,  
    },
    subtitle: {
        fontFamily: "PT Sans"
    },
    media:{
      height: 350,
    }
})

class TeamMember extends React.Component {

    render(){
        const { classes, name, image, role } = this.props;

        return(
            <Grid xs={12} sm={6}  md={3} item>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.media}
                    image={image}
                    title={name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="headline" className={classes.subtitle} component="h2">
                      {name}
                    </Typography>
                    <Typography component="p" className={classes.subtitle}>
                      {role}
                    </Typography>
                  </CardContent>
                  <CardActions>

                  </CardActions>
                </Card>
            </Grid>
        );
    }
}

TeamMember.propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
}

export default withStyles(styles)(TeamMember);
