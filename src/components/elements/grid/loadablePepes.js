import React from "react";
import {withLoading} from "../../utils/WithFetching";
import PepeAPI from "../../../api/api";

const loadablePepesInner = (BaseComponent) =>
    ({classes, header, data, isLoading, loadingEl, error, errorEl, ...otherProps}) => {

    return <BaseComponent pepes={data} pepesLoaded={isLoading} pepesErrored={error} {...otherProps}/>
};

const loadablePepes = (BaseComponent) => withLoading(async (props) => {

    // a map of <name, id>
    const mapSpec = props.pepes;
    const keys = mapSpec.keys();
    const values = await Promise.all(mapSpec.values().map((pepeId) => PepeAPI.getPepeData(pepeId)));

    // zip results with keys
    return new Map(keys.map(function(key, i) {
        return [key, values[i]];
    }));
}
)(loadablePepesInner(BaseComponent));

// Properties:
//  pepes = a map of <name, id> to load data for. The returned data is <name, pepe>.
//  loadingEl = the element to show while loading
//  errorEl = the element to show when all else fails.

export default loadablePepes;
