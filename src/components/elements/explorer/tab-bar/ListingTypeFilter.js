import React from "react";
import PropTypes from 'prop-types';
import {withStyles} from "@material-ui/core/styles";
import {
    Tab, Tabs, Grid, Divider
} from "@material-ui/core";
import QueryChanger from "../QueryChanger";
import OrderPick from "./OrderPick";


const styles = theme => ({
    root: {
        padding: "0 8px 0 8px"
    },
    bar: {

    },
    box: {

    }
});

class ListingTypeFilter extends QueryChanger {

    constructor(props) {
        super(props);

        this.state = {
            main: 0,
            normal: 0,
            sale: 0,
            cozy: 0
        };
    }

    componentDidMount() {
        const query = this.getQuery();
        const listingType = query.getListingType();
        const pepeState = query.getPepeState();
        let main = 0, normal = 0, sale = 0, cozy = 0;
        if (listingType === "sale") main = 1;
        if (listingType === "cozy") main = 2;
        if (pepeState === undefined) normal = 0;
        if (pepeState === "normal") normal = 1;
        if (pepeState === "cozy_cooldown") normal = 2;
        if (pepeState === "sale") sale = 0;
        if (pepeState === "sale_expired") sale = 1;
        if (pepeState === "cozy") cozy = 0;
        if (pepeState === "cozy_expired") cozy = 1;
        this.setState({
            main: main,
            normal: normal,
            sale: sale,
            cozy: cozy
        });
    }

    tabChange = (tabGroupName) => (event, value) => {
        const query = this.getQuery();
        if (value < 0) return;
        let subTabIndex = value;

        let stateType = tabGroupName;
        // If this is the super tab, then update the listing type
        if (tabGroupName === "main") {
            const listingType = ([undefined, "sale", "cozy"])[value];
            query.changeListingType(listingType);

            // Make sure the subtab value is used to update the pepe_state
            stateType = listingType || "normal";
            subTabIndex = this.state[stateType];
        }

        // Now update the pepe_state
        if (stateType === "normal") query.changePepeState(([undefined, "normal", "cozy_cooldown"])[subTabIndex]);
        else if (stateType === "sale") query.changePepeState((["sale", "sale_expired"])[subTabIndex]);
        else if (stateType === "cozy") query.changePepeState((["cozy", "cozy_expired"])[subTabIndex]);

        this.setState(() => tabGroupName === "main"
            ? ({main: value}) : ({[tabGroupName]: subTabIndex})
        );

        this.fire();
    };

    render() {

        const {classes} = this.props;
        const {main, normal, sale, cozy} = this.state;

        const listingType = (["normal", "sale", "cozy"])[main];

        return (
            <div className={classes.root}>
                <Grid container spacing={8} className={classes.bar} justify="center">
                    <Grid item xs={12} sm={12} md={9} lg={10} className={classes.box}>
                        <Tabs
                            value={main}
                            onChange={this.tabChange("main")}
                            indicatorColor="primary"
                            textColor="primary"
                            fullWidth
                            centered
                        >
                            <Tab label="All pepes"/>
                            <Tab label="For sale"/>
                            <Tab label="Wants to Hop"/>
                        </Tabs>
                        <Divider/>
                        {main === 0 &&
                        <Tabs
                            value={normal}
                            onChange={this.tabChange("normal")}
                            indicatorColor="primary"
                            textColor="primary"
                            fullWidth
                            centered
                        >
                            <Tab label="All"/>
                            <Tab label="Can hop"/>
                            <Tab label="Hop cooldown"/>
                        </Tabs>
                        }
                        {main === 1 &&
                        <Tabs
                            value={sale}
                            onChange={this.tabChange("sale")}
                            indicatorColor="primary"
                            textColor="primary"
                            fullWidth
                            centered
                        >
                            <Tab label="Active"/>
                            <Tab label="Expired"/>
                        </Tabs>
                        }
                        {main === 2 &&
                        <Tabs
                            value={cozy}
                            onChange={this.tabChange("cozy")}
                            indicatorColor="primary"
                            textColor="primary"
                            fullWidth
                            centered
                        >
                            <Tab label="Active"/>
                            <Tab label="Expired"/>
                        </Tabs>
                        }
                    </Grid>

                    <Grid item xs={12} sm={12} md={3} lg={2} className={classes.box}>
                        <OrderPick getQuery={this.getQuery}
                                   fire={this.fire}
                                   listingType={listingType}/>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

ListingTypeFilter.propTypes = {
    getQuery: PropTypes.func.isRequired,
    fire: PropTypes.func.isRequired
};

export default withStyles(styles)(ListingTypeFilter);