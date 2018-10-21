import React from "react";
import connect from "react-redux/es/connect/connect";
import PropTypes from "prop-types";
import PepeGrid from "./PepeGrid";
import ReporterContent from "../reporting/ReporterContent";
import pepeAT from "../../../reducers/pepe/pepeAT";

class QueriedPepes extends React.Component {

    componentDidMount() {
        if (this.props.queries) {
            for (let i = 0; i < this.props.queries.length; i++) {
                const queryStr = this.props.queries[i];
                this.props.dispatch({
                    type: pepeAT.QUERY_PEPES,
                    queryStr,
                    force: false
                });
            }
        }
    }

    render() {
        const {pepes, loading, errors, children} = this.props;

        return (
            <div>
                {
                    loading && <ReporterContent variant="info" message="Loading pepes..."/>
                }
                {
                    !loading && ((errors || []).map((err, i) => (<ReporterContent key={"error-"+i} variant="error" message={err}/>)))
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
    let loadingQueries = false;
    for (let i = 0; i < queries.length; i++) {
        const queryStr = queries[i];
        const queryData = state.pepe.pepeQueries[queryStr];

        if (!queryData) {
            loadingQueries = true;
            continue;
        }

        if (queryData.error) {
            errors.push(queryData.error);
        } else if (queryData.pepeIds) {
            queryData.pepeIds.forEach(pepeId => nonDuplicates.add(pepeId));
        }
    }

    return ({
        pepes: Array.from(nonDuplicates),
        loading: loadingQueries,
        errors
    })
})(QueriedPepes);

ConnectedQueriedPepes.propTypes = {
    queries: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ConnectedQueriedPepes;
