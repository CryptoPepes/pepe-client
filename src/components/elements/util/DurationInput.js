import React from "react";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {TextField} from "@material-ui/core";

const styles = (theme) => ({
    root: {

    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 100,
    },
});



class DurationInput extends React.Component {

    constructor(props) {
        super();
        this.state = {
            days: props.initialDays || 0,
            hours: props.initialHours || 0,
            minutes: props.initialMinutes || 0,
            seconds: props.initialSeconds || 0,
            valid_days: true,
            valid_hours: true,
            valid_minutes: true,
            valid_seconds: true
        }
    }

    componentDidMount() {

        // Forces an callback, to pass the initial duration.
        this.componentDidUpdate(null, {}, null);
    }

    componentDidUpdate(prevProps, prevState, _) {

        // If there is nothing to call, then don't
        if (!this.props.onDurationChange) return;

        const {days, hours, minutes, seconds,
            valid_days, valid_hours, valid_minutes, valid_seconds } = this.state;

        // the inputs were changed.
        if (prevState.days !== days || prevState.hours !== hours
                || prevState.minutes !== minutes || prevState.seconds !== seconds) {

            // if valid: update duration, if not, update, but tell that it's an invalid duration.
            if (valid_days && valid_hours && valid_minutes && valid_seconds) {
                // Calculate the duration in seconds
                const duration = (((days * 24 + hours) * 60 + minutes) * 60) + seconds;

                this.props.onDurationChange(duration, true);
            } else {
                this.props.onDurationChange(0, false);
            }
        }
    }

    handleChange = name => event => {
        let numberValue = 0;
        let valid = true;
        try {
            if (event.target.value === "") {
                valid = false;
                numberValue = "";
            } else {
                numberValue = parseFloat(event.target.value);
                if (isNaN(numberValue) || numberValue < 0) {
                    valid = false;
                    numberValue = 0;
                }
            }
        } catch (e) {
            valid = false;
            numberValue = 0;
        }

        this.setState({
            [name]: numberValue,
            ["valid_"+name]: valid
        });

    };

    render() {
        const {classes} = this.props;

        const {days, hours, minutes, seconds,
            valid_days, valid_hours, valid_minutes, valid_seconds } = this.state;

        return (

            <form className={classes.root} noValidate autoComplete="off">

                <TextField
                    error={!valid_days}
                    helperText={valid_days ? null : "Invalid"}
                    label="Days"
                    value={days}
                    onChange={this.handleChange('days')}
                    type="number"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                />
                <TextField
                    error={!valid_hours}
                    helperText={valid_hours ? null : "Invalid"}
                    label="Hours"
                    value={hours}
                    onChange={this.handleChange('hours')}
                    type="number"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                />
                <TextField
                    error={!valid_minutes}
                    helperText={valid_minutes ? null : "Invalid"}
                    label="Minutes"
                    value={minutes}
                    onChange={this.handleChange('minutes')}
                    type="number"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                />
                <TextField
                    error={!valid_seconds}
                    helperText={valid_seconds ? null : "Invalid"}
                    label="Seconds"
                    value={seconds}
                    onChange={this.handleChange('seconds')}
                    type="number"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                />
            </form>
        )
    }
}

DurationInput.propTypes = {
    // Called with the new duration in number of seconds, and whether it's valid or not.
    onDurationChange: PropTypes.func.isRequired,
    initialDays: PropTypes.number,
    initialHours: PropTypes.number,
    initialMinutes: PropTypes.number,
    initialSeconds: PropTypes.number,
};

export default withStyles(styles)(DurationInput);
