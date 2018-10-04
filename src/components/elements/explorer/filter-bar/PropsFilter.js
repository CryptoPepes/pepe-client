import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import {
    Divider,
    FormControl, FormGroup, FormHelperText, IconButton, Input, InputLabel,
    Select, MenuItem
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import QueryTextual from "../../../../api/query_textual";
import QueryChanger from "../QueryChanger";
import ChipArray from "../../util/ChipArray";


const styles = theme => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    menuItem: {
        padding: "4px 16px 4px 16px"
    }
});

class PropsFilter extends QueryChanger {

    constructor(props){
        super(props);

        this.state = {
            chipData: QueryTextual.getPepePropertiesMap(),
        };

        // Get the first key as default (list of pairs, get key of first pair)
        this.state.selectedProperty = Array.from( this.state.chipData )[0][0];
    }


    componentDidMount() {
        const query = this.getQuery();
        const propsList = query.getProps();

        if (propsList === undefined || propsList.length <= 0) return;

        const chipMap = new Map();
        for (let key of propsList) {
            const label = this.state.chipData.get(key);
            //skip if unknown
            if(!label) continue;

            chipMap.set(key, label);
        }
        this.chipArray.addChips(chipMap);

        query.setPropsCallback(() => {
            query.changeProps(this.chipArray.getChipIds());
        });
    }

    changeFenoPropSelect = event => {
        this.setState({ selectedProperty: event.target.value });
    };

    addFenoProperty = () => {
        const key = this.state.selectedProperty;
        const label = this.state.chipData.get(key);

        // ignore unknown / invalid / empty properties.
        if(!label) return;

        this.chipArray.addChip(key, label);

        const query = this.getQuery();
        query.setPropsCallback(() => {
            query.changeProps(this.chipArray.getChipIds());
        });

    };

    render() {

        const {classes} = this.props;

        return (
            <div>
                <FormGroup row>
                    <FormControl>
                        <InputLabel htmlFor="feno-property-native-helper">Pepe
                            property</InputLabel>
                        <Select
                            displayEmpty
                            value={this.state.selectedProperty}
                            onChange={this.changeFenoPropSelect}
                            input={<Input id="feno-property-native-helper"/>}
                        >
                            {
                                Array.from( this.state.chipData )
                                    .map(([key, value]) =>
                                        (<MenuItem className={classes.menuItem} key={key} value={key}>{value}</MenuItem>))
                            }
                        </Select>

                        <FormHelperText>Select property to add</FormHelperText>
                    </FormControl>
                    <IconButton onClick={this.addFenoProperty} style={{height: 68}} aria-label="Add pepe property">
                        <AddIcon/>
                    </IconButton>
                </FormGroup>
                <br/>
                <Divider/>
                <br/>
                <ChipArray onRef={(arr) => { this.chipArray = arr; }}
                           deletableItems={true}/>
            </div>
        );
    }
}

PropsFilter.propTypes = {
    getQuery: PropTypes.func.isRequired
};

export default withStyles(styles)(PropsFilter);