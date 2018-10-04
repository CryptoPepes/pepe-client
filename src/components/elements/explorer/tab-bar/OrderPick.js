import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import {
    FormControl, Input, InputLabel,
    Select
} from "@material-ui/core";
import QueryTextual from "../../../../api/query_textual";
import {QueryHelper} from "../../../../api/query_helper";
import QueryChanger from "../QueryChanger";


const styles = theme => ({
    root: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column"
    }
});

class OrderPick extends QueryChanger {


    constructor(props){
        super(props);

        this.state = {
            order: QueryHelper.defaultSortOrder
        };
    }

    componentDidMount() {
        const query = this.getQuery();
        const ord = query.getOrder();
        if (ord === undefined) return;
        this.setState({ order: ord });
    }

    handleChange = event => {
        const query = this.getQuery();
        query.changeOrder(event.target.value);
        this.setState({ order: event.target.value });
        this.fire();
    };

    render() {

        const {classes, listingType} = this.props;
        const {order} = this.state;

        return (
            <div className={classes.root}>
                <FormControl>
                    <InputLabel htmlFor="sorting-select-native">Sort by...</InputLabel>

                    <Select native
                            value={order}
                            onChange={this.handleChange}
                            input={<Input id="sorting-select-native" />}>
                        {
                            QueryHelper.sortOrders[listingType || "normal"].map(sortOrderId =>
                                (<option key={sortOrderId} value={sortOrderId}>{QueryTextual.getSortText(sortOrderId)}</option>))
                        }
                    </Select>
                </FormControl>
            </div>
        );
    }
}

OrderPick.propTypes = {
    getQuery: PropTypes.func.isRequired,
    fire: PropTypes.func.isRequired,
    // The type of listing to show sorting orders for. "normal", "sale" or "cozy"
    listingType: PropTypes.string.isRequired
};

export default withStyles(styles)(OrderPick);