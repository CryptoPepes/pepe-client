import React, {Component} from 'react';
import { withStyles } from "@material-ui/core/styles";
import {Grid, Typography, Button} from "@material-ui/core";
import TeamMember from '../elements/about/TeamMember';

const styles = theme => ({
    greyBg: {
        background: theme.palette.grey["200"],
    },
    title: {
      color: "inherit",
      textTransform: "uppercase",
      fontFamily: "PT Sans"
    },
    subtitle: {
        margin: (theme.spacing.unit * 5) + "px " + "0px",
        color: theme.palette.primary.main,
        fontFamily: "PT Sans"
    },
    greyBg: {
        background: theme.palette.type === 'light' ? "#f3f3f3" : theme.palette.background.default,
    },
    aboutHeading: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.background.default,
        color: "white",
        padding: (theme.spacing.unit * 5) + "px " + "0px",
        fontFamily: "PT Sans"
    },
    subheading: {
        color: "inherit",
        fontFamily: "PT Sans"
    },
    padBottom: {
        paddingBottom: theme.spacing.unit * 5 + 20,
    },
    sectionText: {
        fontFamily: "PT Sans",
        fontSize: "1.2rem"
    }
});

class About extends Component {

    render() {
        const { classes } = this.props;
        return (
          <div>
              <div>
                  <Grid className={classes.aboutHeading} container>
                      <Grid item xs={12}>
                          <Typography component="h2" className={classes.subheading} align="center" variant="subheading">Meet the Team</Typography>
                          <Typography className={classes.title} align="center" variant="display3">
                              About us
                          </Typography>
                      </Grid>
                  </Grid>
              </div>

              <div style={{padding: "0px 40px"}}>
                  <Grid container className={classes.padBottom} justify="center" >
                      <Grid item xs={12} sm={12} md={8}>
                          <Typography className={classes.subtitle} component="h2" align="center" variant="display1">
                              CryptoPepes
                          </Typography>

                          <Typography component="p" className={classes.sectionText} paragraph>
                              CryptoPepes is a game where you can breed, collect and fight digital frogs.
                              All CryptoPepes are ERC721 tokens living on the Ethereum blockchain and are 100% owned by you!
                          </Typography>

                          <Typography component="p" className={classes.sectionText}>
                              No Pepe is the same due to our unique gene algorithm which mixes genes in a way very similar to humans.
                              Some characteristics are more rare than others so they require carefull breeding to get them to show in your Pepe.
                              You can collect, breed, sell and in the near future fight your pepes in epic battles.
                          </Typography>
                      </Grid>
                  </Grid>
              </div>

              <div className={classes.greyBg} style={{padding: "0px 40px"}}>
                  <Grid className={classes.padBottom} container justify="center" spacing={40}>
                      <Grid item xs={12}>
                          <Typography className={classes.subtitle} component="h2" align="center" variant="display1">
                              Our Team
                          </Typography>
                      </Grid>
                      <TeamMember name="Programmerror" role="Development" image="https://dev.cryptopepes.io/api/getPepeSVG/100"></TeamMember>
                      <TeamMember name="Pablo" role="Development" image="https://dev.cryptopepes.io/api/getPepeSVG/101"></TeamMember>
                      <TeamMember name="CR-MN" role="Marketing" image="http://botapi.cryptopepes.io/profilepic?size=500&seed=1113&hair-type=thuglife&glasses-type=thug-life&glasses-primary-color=000000&glasses-secondary-color=ffffff&mouth=fake_smile&neck=dollar_necklace&format=svg"></TeamMember>
                      <TeamMember name="Bribu" role="Design" image="https://dev.cryptopepes.io/api/getPepeSVG/103"></TeamMember>
                  </Grid>
              </div>

              <div style={{padding: "0px 40px"}}>
                  <Grid className={classes.padBottom} container justify="center">
                      <Grid item xs={12}>
                          <Typography className={classes.subtitle} component="h2" align="center" variant="display1">
                              Our Mission
                          </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                          <Typography variant="title" gutterBottom className={classes.sectionText}>
                            Building the next generation of blockchain games.
                          </Typography>

                          <Typography component="p" paragraph className={classes.sectionText}>
                              We want to build the best blockchain gaming experience so far.
                              By utilizing state channels and the power of the Ethereum blockchain we can deliver a gaming experience unseen in other blockchain games.
                          </Typography>

                          <Typography component="p" paragraph className={classes.sectionText}>
                              CryptoPepes is focussed on decentralisation and fair distribution of the game assets. That{"'"}s gen 0 pepes will only be minted by participating in POW mining.
                          </Typography>

                          <Typography component="p" paragraph>

                          </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                          <Typography component="p" paragraph className={classes.sectionText}>
                              We are changing the way game assets are owned and how you play online games. No central party will ever have control over your Pepe or your ability to battle others.
                          </Typography>

                          <Typography variant="title" gutterBottom className={classes.sectionText}>
                              Why Pepe the Frog?
                          </Typography>

                          <Typography component="p" paragraph className={classes.sectionText}>
                              To make Pepe great again!
                          </Typography>

                          <Typography component="p" paragraph className={classes.sectionText}>
                              We love the Pepe the Frog community and were inspired by the creativity in the community.
                              Of course Pepes are way cooler than silly cats.
                          </Typography>
                      </Grid>

                  </Grid>
              </div>

          </div>
        )
    }
}

export default withStyles(styles)(About);
