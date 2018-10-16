import React, {Component} from 'react';
import {Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import {BN} from "web3-utils";
import mining_abi from "../../abi/mining_abi.json";
import {miningAddr} from "../../web3Settings";
import Web3StatusRedirector from "./Web3StatusRedirector";

// TODO 
// - Add better styling
// - Add average blocktime
// ....

const styles = theme => ({
    root: {
        display: "flex",
        overflow: "hidden",
        justifyContent: "center",
    },
    container: {
        maxWidth: 1024,
        flex: '1 0 100%',
        marginTop: theme.spacing.unit * 4,
    },
    pepReward: {
        backgroundColor: theme.palette.type === 'light' ? "#d0f4d1" : theme.palette.background.default,
    },

});

class MiningStats extends Component {

    constructor(props) {
        super(props);
        this.state = {
            targetCallID: undefined,
            epochCallID: undefined,
            rewards: [],
        };
    }

    componentDidMount() {
        this.mounted = true;

        const {contracts} = this.props;
        if(contracts.Mining) { 
            const target = contracts.Mining.methods.getMiningTarget.cacheCall({});
            this.setState({targetCallID: target.callID});
            this.props.dispatch(target.thunk);
        }
        const web3 = window.pepeWeb3v1;

        const MiningContract = new web3.eth.Contract(mining_abi, miningAddr);
        
        pepeWeb3v1.eth.getBlockNumber().then((blockNumber) => {
            MiningContract.getPastEvents("Mint", {fromBlock: blockNumber - 3100}, this.addMint);
        });
        
        MiningContract.events.Mint(this.addMintOne);
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    addMint = (error, events) => {
        if(this.mounted){
            this.setState({
                rewards: events,
            });
        } 
    };

    addMintOne = (error, event) => {
        if(this.mounted) {
            this.setState({
                rewards: this.state.rewards.concat([event]),
            });
        } 
    };

    calcHashrate = (data) => {
        if(!data || !data.value) {
            return "Loading";
        }

        //TODO make better difficulty calculation
        const target = new BN(data.value[0], 10); //target to reach
        const max = new BN("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16);
        let p = max.div(target);
        p = p.div(new BN(1000000)).div(new BN(430));

        return((p.toNumber() / 1000 / 2) + " GH/s");
    };

    shorten(value) {
        return(value.substr(0, 6) + "..." + value.substr(-5, 5));
    }

    getEpoch = () => {
        const {rewards} = this.state;
        if(!!rewards && rewards.length !== 0 && rewards[rewards.length - 1].returnValues) {
            return parseInt(rewards[rewards.length - 1].returnValues.epochCount);
        }
        return 0;
    };

    render() {
        const {classes, data} = this.props;
        const {targetCallID, epochCallID, rewards} = this.state;
        const hashrate = this.calcHashrate(data[targetCallID]);

        const epoch = this.getEpoch();

        return (
            <div className={classes.root} style={{padding: "0px 20px"}}>
                <Grid className={classes.container} container>
                    <Grid item xs={3}>
                        <Typography align="center"><strong>Hashrate</strong> <br /> {hashrate}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography align="center"><strong>Next Readjust</strong> <br /> {epoch !== 0 ? (20 - (epoch - 1) % 20) : "Loading"}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography align="center"><strong>Next CPEP</strong> <br /> {epoch !== 0 ? (16 - (epoch - 1) % 16) : "Loading"}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography align="center"><strong>Rewards Mined</strong> <br /> {epoch !== 0 ? (epoch) : "Loading"}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Table className={classes.table}>
                            <TableHead>
                            <TableRow>
                                <TableCell>Reward Number</TableCell>
                                <TableCell>Block Number</TableCell>
                                <TableCell>Tx Hash</TableCell>
                                <TableCell>Miner</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {rewards.length !== 0 && rewards.slice(0).reverse().map(reward => {
                                return (
                                <TableRow className={(parseInt(reward.returnValues.epochCount ) - 1) % 16 === 0 ?  classes.pepReward : classes.normal} key={reward.blockHash}>
                                    <TableCell className={classes.tableCell} component="th" scope="row">
                                        {reward.returnValues.epochCount}
                                    </TableCell>
                                    <TableCell className={classes.tableCell} component="th" scope="row">
                                        {reward.blockNumber}
                                    </TableCell>
                                    <TableCell className={classes.tableCell} >
                                        <a target="_blank" href={"https://etherscan.io/tx/" + reward.transactionHash}>{this.shorten(reward.transactionHash)}</a>
                                    </TableCell>
                                    <TableCell className={classes.tableCell}>
                                        <Link to={"/portfolio/" + reward.returnValues.from}>
                                            {this.shorten(reward.returnValues.from)}   
                                        </Link>
                                    </TableCell>
                                </TableRow>
                                );
                            })}
                            </TableBody>
                        </Table>
                    </Grid> 
                </Grid>
            </div>
        )
    }
}

const styledMiningStats = withStyles(styles)(MiningStats);

const ConnectedMiningStats = connect(state => ({
    contracts: state.redapp.contracts,
    data: state.redapp.tracking.calls,
}))(styledMiningStats);

const MiningStatsWeb3Checked = () => {
    const miningStatsCreator = () => <ConnectedMiningStats/>;
    // Having no account is fine, web3 needs to be active however.
    return <Web3StatusRedirector dstNoAccount={miningStatsCreator} dstAddrOk={miningStatsCreator}/>;
};

export default MiningStatsWeb3Checked;
