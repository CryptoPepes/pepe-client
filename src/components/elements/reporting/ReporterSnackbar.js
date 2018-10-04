import React from "react";
import Snackbar from '@material-ui/core/Snackbar';
import ReporterContent from "./ReporterContent";
import ActionDialog from "../util/Closeable";
import PropTypes from "prop-types";


class ReporterSnackBar extends ActionDialog {

    render() {
        const anchor = this.props.anchorOrigin ? {
            vertical: this.props.anchorOrigin.vertical || 'bottom',
            horizontal: this.props.anchorOrigin.horizontal || 'center',
        } : {vertical: 'bottom', horizontal: 'center'};

        return (
            <Snackbar
                anchorOrigin={anchor}
                open={this.state.isOpen}
                autoHideDuration={this.props.autoHideDuration}
                onClose={this.handleOpen(false)}
            >
                <ReporterContent
                    onClose={this.handleOpen(false)}
                    variant={variant}
                    message={message}
                />
            </Snackbar>
        );
    }
}

ReporterSnackBar.defaultProps = {
    autoHideDuration: 6000
};

ReporterSnackBar.propTypes = {
    onClose: PropTypes.func,
    anchorOrigin: PropTypes.shape({
       horizontal: PropTypes.oneOf(['left', 'center', 'right']),
       vertical: PropTypes.oneOf(['top', 'center', 'bottom'])
    }),
    message: PropTypes.node,
    variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
    autoHideDuration: PropTypes.number
};

export default ReporterSnackBar;
