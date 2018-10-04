import AdvancedLink from "./AdvancedLink";
import {Button} from "@material-ui/core";
import {OpenInNew} from "@material-ui/icons";
import {withStyles} from "@material-ui/core/styles";
import React from "react";
import PropTypes from "prop-types";

const styles = theme => ({
    etherscanBtn: {
        backgroundColor: theme.palette.type === "light" ? "#3498db" : "#174763",
        '&:hover': {
            backgroundColor: theme.palette.type === "light" ? "#36a8ed" : "#1b587c",
        },
        color: "#fff"
    }
});

// TODO: change to main-net link for release.
const etherscanBaseLink = "https://ropsten.etherscan.io/";

const EtherscanBtn = ({children, classes, link, size}) => (
    <AdvancedLink to={etherscanBaseLink + link} external newTab disableLinkPadding>
        <Button className={classes.etherscanBtn} size={size}>
            {children}
            <OpenInNew className={classes.rightIcon} />
        </Button>
    </AdvancedLink>
);

EtherscanBtn.defaultProps = {
    size: "small"
};

EtherscanBtn.propTypes = {
    classes: PropTypes.object.isRequired,
    link: PropTypes.string,
    size: PropTypes.string
};

export default withStyles(styles)(EtherscanBtn);