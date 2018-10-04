import React from "react";
import {Chip} from "@material-ui/core";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

const styles = (theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: theme.spacing.unit / 2,
    },
    chip: {
        margin: theme.spacing.unit / 2,
    },
});

class ChipArray extends React.Component {

    constructor(props) {
        super();
        this.state = {
            items: props.items || new Map()
        }
    }

    componentDidMount() {
        if (this.props.onRef) this.props.onRef(this)
    }
    componentWillUnmount() {
        if (this.props.onRef) this.props.onRef(null)
    }

    getChipIds() {
        return Array.from( this.state.items.keys() );
    }

    /**
     * Add multiple chips at once.
     * @param labeledKeys The properties, a Map, keys: prop-keys, values: labels.
     */
    addChips(labeledKeys) {
        //Note: this overwrites the old value if key was already present.

        //copy all contents, state array itself is immutable,
        // change the array as a whole.
        const newSelection = new Map([...this.state.items, ...labeledKeys]);

        this.setState({ items: newSelection})
    }

    addChip(key, label) {
        //Note: this overwrites the old value if key was already present.

        //copy all contents, state array itself is immutable,
        // change the array as a whole.
        const newSelection = new Map(this.state.items);
        newSelection.set(key, label);

        this.setState({ items: newSelection})
    }

    removeChip(chipKey) {
        const newSelection = new Map(this.state.items);
        newSelection.delete(chipKey);

        this.setState({ items: newSelection})
    };

    chipRemover = chipKey => () => {
        this.removeChip(chipKey);
    };

    render() {

        const { classes, deletableItems } = this.props;

        return (
            <div className={classes.root}>
                {Array.from( this.state.items ).map(([key, value]) =>
                    (<Chip key={key} label={value}
                              className={classes.chip}
                              onDelete={deletableItems ? this.chipRemover(key) : undefined}/>)
                )}
            </div>
        )
    }
}


ChipArray.propTypes = {
    classes: PropTypes.object.isRequired,
    items: PropTypes.instanceOf(Map),
    deletableItems: PropTypes.bool,
    onRef: PropTypes.func
};

export default withStyles(styles)(ChipArray);
