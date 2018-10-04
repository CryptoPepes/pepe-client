import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import {
    FormControl, Input,
    Select, MenuItem,
    Typography
} from "@material-ui/core";
import QueryTextual from "../../../../api/query_textual";
import {QueryHelper} from "../../../../api/query_helper";
import QueryChanger from "../QueryChanger";


const styles = theme => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    menuItem: {
        padding: "4px 16px 4px 16px"
    }
});

class CooldownFilter extends QueryChanger {

    constructor(props){
        super(props);

        this.state = {
            cooldown: QueryHelper.defaultCooldown
        };
    }

    componentDidMount() {
        const query = this.getQuery();
        const cool = query.getCooldown();
        if (cool === undefined) return;
        this.setState({ cooldown: cool });
    }


    handleChange = event => {
        const query = this.getQuery();
        query.changeCooldown(event.target.value);
        this.setState({ cooldown: event.target.value });
    };

    render() {

        const {classes} = this.props;
        const {cooldown} = this.state;

        return (
            <div>
                <Typography className={classes.heading}>Cooldown</Typography>
                <FormControl>
                    <Select displayEmpty
                            value={cooldown}
                            onChange={this.handleChange}
                            input={<Input id="filter-generation" />}>
                        {
                            QueryHelper.coolDownOptions.map(cooldownId =>
                                (<MenuItem className={classes.menuItem} key={cooldownId} value={cooldownId}>{QueryTextual.getCooldownText(cooldownId)}</MenuItem>))
                        }
                    </Select>
                </FormControl>
            </div>
        );
    }
}

CooldownFilter.propTypes = {
    getQuery: PropTypes.func.isRequired
};

export default withStyles(styles)(CooldownFilter);