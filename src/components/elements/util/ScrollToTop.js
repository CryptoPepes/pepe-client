import React from "react";
import {withRouter} from "react-router-dom";

// See: https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/guides/scroll-restoration.md
class ScrollToTop extends React.Component {

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return this.props.children || null;
    }
}

export default withRouter(ScrollToTop);
