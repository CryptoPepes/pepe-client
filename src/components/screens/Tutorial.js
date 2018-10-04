import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";
import {Grid, Typography} from "@material-ui/core";


const styles = theme => ({
    greyBg: {
        background: theme.palette.grey["200"],
    },
    title: {
      color: "inherit",
      textTransform: "uppercase",
      fontFamily: "PT Sans"
    },
    tutHeading: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.background.default,
        color: "white",
        padding: (theme.spacing.unit * 5) + "px " + "0px",
        fontFamily: "PT Sans"
    },
    subheading: {
        color: "inherit",
        fontFamily: "PT Sans"
    },
});

class Tutorial extends Component {

    render() {
        const { classes } = this.props;
        return (
          <div>
              <div>
                  <Grid className={classes.tutHeading} container>
                      <Grid item xs={12}>
                          <Typography component="h2" className={classes.subheading} align="center" variant="subheading">So, how does this work?</Typography>
                          <Typography className={classes.title} align="center" variant="display3">
                              Tutorial
                          </Typography>
                      </Grid>
                  </Grid>
              </div>

              <div style={{padding: "40px 40px"}} align="center">
                  <Grid item xs={12} sm={10} md={8} lg={6} align="left">

                      <p className={classes.subheading}> Tutorial text is yet to come.</p>
                  </Grid>
              </div>
          </div>
        )
    }
}

export default withStyles(styles)(Tutorial);
