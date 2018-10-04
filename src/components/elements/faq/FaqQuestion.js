import React, {Component} from "react";
import {
    Typography,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails
} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
    heading: {
        ...theme.typography.headline,
        fontSize: '1.3rem'
    },
    text: {
        ...theme.typography.body1,
        fontSize: '1rem'
    }
});

class FaqQuestion extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const classes = this.props.classes;
        return (
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    <div className={classes.heading}>{this.props.question}</div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <div className={classes.text} dangerouslySetInnerHTML={{__html: this.props.answer}}/>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }

}

FaqQuestion.propTypes = {
    classes: PropTypes.object.isRequired,
    question: PropTypes.string,
    answer: PropTypes.string
};

export default withStyles(styles)(FaqQuestion);