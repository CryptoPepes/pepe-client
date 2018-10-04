import React from "react";
import PropTypes from "prop-types";

/**
 * Lightweight base class for dialogs etc. to use,
 *  *without* defining/rendering any of the component itself.
 */
class Closeable extends React.Component {

    constructor(props) {
        super();

        this.state = {
            isOpen: !!props.open
        }
    }

    componentWillReceiveProps (nextProps, nextContext) {
        this.setState(prevState =>
            (prevState.isOpen === !!nextProps.open) ? null : {isOpen: !!nextProps.open});
    }

    /**
     * @param open {boolean} True if the state should be set to "open".
     * @return {Function}
     */
    handleOpen = (open) => {
        return () => {
            this.setState({
                isOpen: open
            });
            if (!open && this.props.onClose) {
                this.props.onClose();
            }
        };
    };

}

Closeable.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
};

export default Closeable;
