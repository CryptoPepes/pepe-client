import React, { Component } from "react";
import PropTypes from 'prop-types';

class QueryChanger extends Component {

    constructor(props) {
        super(props);
        //bind to class, to use in functions without context problems.
        this.getQuery = this.getQuery.bind(this);
        this.fire = this.fire.bind(this);
    }

    /**
     * Get the query to make changes to.
     * @return {Query}
     */
    getQuery() {
        return this.props.getQuery()
    }

    /**
     * Fire the query; calls the fire callback.
     */
    fire() {
        return this.props.fire()
    }

}

QueryChanger.propTypes = {
    getQuery: PropTypes.func.isRequired,
    fire: PropTypes.func
};

export default QueryChanger;
