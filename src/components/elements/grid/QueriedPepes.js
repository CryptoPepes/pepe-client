import React from "react";
import connect from "react-redux/es/connect/connect";
import PropTypes from "prop-types";
import PepeGrid from "./PepeGrid";
import ReporterContent from "../reporting/ReporterContent";

class QueriedPepes extends React.Component {

    render() {
        const {pepes, errors} = this.props;

        return (
            <div>
                {
                    (errors || []).map(err => (<ReporterContent variant="error" message={err}/>))
                }
                {pepes && pepes.length !== 0 && children}
                <PepeGrid items={pepes}/>
            </div>
        )
    }

}

const ConnectedQueriedPepes = connect((state, props) => {

    const queries = props.queries;
    const nonDuplicates = new Set();
    const errors = [];
    for (let i = 0; i < queries.length; i++) {
        const queryStr = queries[i];
        const queryData = state.pepe.pepeQueries[queryStr];
        if (!queryData.err) {
            errors.push(queryData.err);
        } else {
            queryData.pepes.forEach(pepeId => nonDuplicates.add(pepeId));
        }
    }

    return ({
        pepes: nonDuplicates,
        errors
    })
})(QueriedPepes);

ConnectedQueriedPepes.propTypes = {
    queries: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ConnectedQueriedPepes;
