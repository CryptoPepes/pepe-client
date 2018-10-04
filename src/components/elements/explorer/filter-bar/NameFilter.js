import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import {
    TextField,
    Typography
} from "@material-ui/core";
import QueryChanger from "../QueryChanger";


const styles = theme => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    searchField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200
    }
});

class NameFilter extends QueryChanger {

    constructor(props){
        super(props);

        this.state = {
            name: ""
        };
    }

    componentDidMount() {
        const query = this.getQuery();
        const pepeName = query.getName();
        if (pepeName === undefined) return;
        this.setState({ name: pepeName });
    }

    handleChange = event => {
        const query = this.getQuery();
        if (event.target.value === "") {
            if (this.state.name !== undefined) {
                query.changeName(undefined);
                this.setState({
                    name: undefined
                });
            }
        } else {
            query.changeName(event.target.value);
            this.setState({name: event.target.value});
        }
    };

    render() {

        const {classes} = this.props;
        const {name} = this.state;

        return (
            <div>
                <Typography className={classes.heading}>Pepe name</Typography>

                <TextField
                    id="name-search"
                    placeholder="Pepe the frog"
                    value={name === undefined ? "" : name}
                    type="search"
                    className={classes.searchField}
                    onChange={this.handleChange}
                    margin="normal"
                />
            </div>
        );
    }
}

NameFilter.propTypes = {
    getQuery: PropTypes.func.isRequired
};

export default withStyles(styles)(NameFilter);