import React from "react";
import {Grid, Typography} from "@material-ui/core";
import FaqQuestion from "./FaqQuestion";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";

const styles = theme => ({
    sectionHeading: {
        ...theme.typography.title,
        fontSize: '1.5rem',
        padding: 20
    },
});

const Faq = ({ data, classes }) => {
    const entries = data.entries || [];

    return (
        <div style={{padding: 20}}>
            <Grid container spacing={40}>
                {entries.map((entry, index) => (
                    <Grid item xs={12} key={index}>
                        <div className={classes.sectionHeading}>{entry.header}</div>
                        {
                            entry.entries.map((entry, index) => (
                                <FaqQuestion key={index} question={entry.question}
                                             answer={entry.answer}>
                                </FaqQuestion>
                            ))
                        }
                    </Grid>
                ))}
            </Grid>
        </div>
    );

};

Faq.propTypes = {
    data: PropTypes.shape({entries: PropTypes.array}).isRequired
};

export default withStyles(styles)(Faq);