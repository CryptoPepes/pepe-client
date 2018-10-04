import PropTypes from "prop-types";
import PepeGrid from "./PepeGrid";
import loadablePepeCollection from "./loadablePepeCollection";
import React from "react";

const LoadableGrid = loadablePepeCollection(PepeGrid);

// Wrapper to describe loadable-grid properties well with propTypes.
const SimplePepeGrid = (props) => (
    <LoadableGrid {...props}/>
);

SimplePepeGrid.propTypes = {
    header: PropTypes.element,
    queries: PropTypes.arrayOf(PropTypes.PropTypes.object)
};

export default SimplePepeGrid;