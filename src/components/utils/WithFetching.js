import React, {Component} from "react";
import makeCancelable from "makecancelable";

/**
 * Component that wraps other components, and does the fetching work.
 *  Loads content with the given loader. Loader is called with component props as argument.
 */
const withLoading = (loader) => (Comp) =>
    class WithLoading extends Component {
        constructor(props) {
            super(props);

            this.state = {
                data: {},
                isLoading: true,
                error: null,
            };
        }

        componentDidMount() {
            this.setState({ isLoading: true });

            this.cancelLoading = makeCancelable(loader(this.props),
                    data => this.setState({ data, isLoading: false }),
                    error => this.setState({ error, isLoading: false })
                );
        }

        componentWillUnmount() {
            if (!!this.cancelLoading) this.cancelLoading();
        }

        render() {
            return <Comp { ...this.props } { ...this.state } />
        }
    };

/**
 * Component that wraps other components, and does the fetching work.
 *  Fetches content from the given URL.
 */
const withFetching = (url) => withLoading(() =>
    fetch(url).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Something went wrong ...');
        }
    })
);

export {withLoading, withFetching} ;
