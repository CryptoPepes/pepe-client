import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import {
    Button,
} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import QueryChanger from "../QueryChanger";

const styles = theme => ({
    rightIcon: {
        marginLeft: theme.spacing.unit,
    }
});

class SearchBtn extends QueryChanger {

    render() {

        const {classes} = this.props;

        return (
            <div>
                <Button variant="raised" color="secondary"
                        onClick={() => this.fire()}>
                    Search!
                    <SearchIcon className={classes.rightIcon}/>
                </Button>
            </div>
        );
    }
}

SearchBtn.propTypes = {
    getQuery: PropTypes.func.isRequired,
    fire: PropTypes.func.isRequired
};

export default withStyles(styles)(SearchBtn);