import React from "react";
import {withLoading} from "../../utils/WithFetching";
import PepeAPI from "../../../api/api";
import {QueryData, QueryError} from "../../../api/model";
import Loading from "../util/Loading";
import ReporterContent from "../reporting/ReporterContent";

const loadablePepeCollectionInner = (BaseComponent) =>
    ({classes, header, hideHeaderOnNoResults, data, isLoading, error, ...otherProps}) => {

    if (isLoading) {
        return <Loading variant="circle-tag">Loading Pepes...</Loading>;
    }

    if (error) {
        return <ReporterContent variant="error" message={
            <span>Error while loading pepes: {error.message}</span>
        }/>;
    }

    const nonDuplicates = [];

    for (let i = 0; i < data.length; i++) {
        let queryRes = data[i];
        if (!(queryRes instanceof QueryData)) {
            if (queryRes instanceof QueryError) {
                console.log(queryRes.errStr);
            } else {
                console.log("Failed to retrieve more content for pepe grid. Unknown response type. Query index: ", i);
            }
        } else {
            nonDuplicates.push(...(
                queryRes.pepes.filter((item) =>
                    nonDuplicates.find((other) => other.pepeId === item.pepeId) === undefined)
            ));
        }
    }

    if (nonDuplicates.length > 0) {
        return (
            <div>
                {header}
                <BaseComponent items={nonDuplicates} {...otherProps}/>
            </div>
        )
    } else {
        return (<div/>)
    }
};

const loadablePepeCollection = (BaseComponent) => withLoading(async (props) =>
    await Promise.all(props.queries.map((q) => PepeAPI.queryPepes(q)))
)(loadablePepeCollectionInner(BaseComponent));

export default loadablePepeCollection;
