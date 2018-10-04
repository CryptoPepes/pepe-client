import React from "react";
import PropTypes from "prop-types";
import {withLoading} from "../../utils/WithFetching";
import PepeAPI from "../../../api/api";
import PepeGridItem from "./PepeGridItem";
import Loading from "../util/Loading";
import ReporterContent from "../reporting/ReporterContent";

const PepeGridItemLoadableInner = ({data, isLoading, error}) => {

    if (isLoading) {
        return <Loading variant="bar-tag">Loading Pepe...</Loading>;
    }

    if (error) {
        return <ReporterContent variant="error" message={
            <span>Error while loading pepe: {error.message}</span>
        }/>;
    }

    return (<PepeGridItem pepe={data}/>)
};

const PepeGridItemLoadable = withLoading((props) => PepeAPI.getPepeData(props.pepeId))(PepeGridItemLoadableInner);

PepeGridItemLoadable.propTypes = {
    pepeId: PropTypes.string.isRequired
};

export default PepeGridItemLoadable;
