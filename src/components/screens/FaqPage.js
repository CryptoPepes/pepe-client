import React, {Component} from 'react';
import Faq from "../elements/faq/Faq";
import {withStyles} from "@material-ui/core/styles";
import {Grid, Typography} from "@material-ui/core";
import faqData from "./faq.json";


const styles = theme => ({
    greyBg: {
        background: theme.palette.grey["200"],
    },
    title: {
      color: "inherit",
      textTransform: "uppercase",
      fontFamily: "PT Sans"
    },
    faqHeading: {
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

class FaqPage extends Component {

    render() {
        const { classes } = this.props;
        return (
          <div>
              <div>
                  <Grid className={classes.faqHeading} container>
                      <Grid item xs={12}>
                          <Typography component="h2" className={classes.subheading} align="center" variant="subheading">Frequently Asked Questions</Typography>
                          <Typography className={classes.title} align="center" variant="display3">
                              FAQ
                          </Typography>
                      </Grid>
                  </Grid>
              </div>

              <div style={{padding: "0px 40px"}} align="center">
                  <Grid item xs={12} sm={10} md={8} align="left">
                      <Faq data={faqData}/>
                  </Grid>
              </div>
          </div>
        )
    }
}

export default withStyles(styles)(FaqPage);
