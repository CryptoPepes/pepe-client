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

class GenFilter extends QueryChanger {

    constructor(props){
        super(props);

        this.state = {
            gen: QueryHelper.defaultGen
        };
    }

    componentDidMount() {
        const query = this.getQuery();
        const g = query.getGen();
        if (g === undefined) return;
        this.setState({ gen: g });
    }

    handleChange = event => {
        const query = this.getQuery();
        query.changeGen(event.target.value);
        this.setState({ gen: event.target.value });
    };

    render() {

        const {classes} = this.props;
        const {gen} = this.state;

        return (
            <div>
                <Typography className={classes.heading}>Generation</Typography>
                <FormControl>
                    <Select displayEmpty
                            value={gen}
                            onChange={this.handleChange}
                            input={<Input id="filter-generation" />}>
                        {
                            QueryHelper.genOptions.map(genId =>
                                (<MenuItem className={classes.menuItem} key={genId} value={genId}>{QueryTextual.getGenText(genId)}</MenuItem>))
                        }
                    </Select>
                </FormControl>
            </div>
        );
    }
}

GenFilter.propTypes = {
    getQuery: PropTypes.func.isRequired
};

export default withStyles(styles)(GenFilter);