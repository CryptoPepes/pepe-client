import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {withRouter} from "react-router-dom";

// Source: https://github.com/ReactTraining/react-router/issues/1982
// This is a HOC to make a component reloadable on page switch,
//  without parent components having to reload.
const reloadable = WrappedComponent => {
    class Reloadable extends Component {
        constructor (props) {
            super(props);
            this.state = {
                reload: false
            }
        }

        componentWillReceiveProps (nextProps) {
            const location = this.props.location;
            const nextLocation = nextProps.location;

            console.log(location);
            console.log(nextLocation);

            if (nextLocation.pathname !== location.pathname) {
                this.setState({ reload: true }, () => this.setState({ reload: false }))
            }
        }

        render () {
            return this.state.reload ? null : <WrappedComponent {...this.props} />
        }
    }

    Reloadable.propTypes = {
        location: PropTypes.object
    };

    return withRouter(Reloadable);
};

export default reloadable
