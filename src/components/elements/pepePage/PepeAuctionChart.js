

import React from "react";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import classNames from 'classnames/bind';
import Web3Utils from "web3-utils";
import connect from "react-redux/es/connect/connect";
import {Typography} from "@material-ui/core";
import {AuctionData} from "../../../api/model";

const styles = (theme) => ({
    root: {
        display: "block",
        height: "100%",
        width: "auto",
        // Force reading direction the chart, it's not real "text" anyway,
        // and it has to align with the axis on the correct side.
        direction: "ltr",
        padding: theme.spacing * 2
    },
    chartText: {
        fontWeight: theme.typography.body2.fontWeight,
        fill: theme.typography.body2.color,
        fontFamily: theme.typography.body2.fontFamily
    }
});

const chartWidth = 1000;
const chartHeight = 400;
const chartPointR = 5;
const chartMarginTop = 10;
const chartMarginLeft = 20;
const chartMarginRight = 140;
const chartMarginBottom = 30;
const fontSize = 20;

const daySecs = 24*60*60;
const week2Secs = daySecs * 7 * 2;

const formatTime = (stampSeconds, duration) => {
    if (duration > daySecs) {
        const dateObj = new Date(stampSeconds * 1000);
        const dateStrParts = dateObj.toDateString().split(' ');
        if (duration > week2Secs) return dateStrParts[1] + ' ' + dateStrParts[2];
        const timeStrParts = dateObj.toTimeString().split(' ')[0].split(':');
        return dateStrParts[2] + ' ' + dateStrParts[1] + ' ' + timeStrParts[0] + ':' + timeStrParts[1];
    } else return new Date(stampSeconds * 1000).toTimeString().split(' ')[0];
};

// substract 200 for price info on the right
const chartInnerWidth = chartWidth - chartMarginLeft - chartMarginRight;
const chartInnerHeight = chartHeight - chartMarginTop - chartMarginBottom;

const PepeAuctionChart = (props) => {
    const {auctionData, auctionType, classes} = props;

    // TODO: add reload button.
    if (auctionData.status === "error") {
        return <div>
            <Typography variant="headline" component="h2">Failed to load auction data.</Typography>
        </div>;
    }

    const isLoading = auctionData.status !== "ok";
    if (isLoading) {
        return <div>
            <Typography variant="caption" component="h3">Loading auction data...</Typography>
        </div>;
    }

    const auction = auctionData.auction;

    const startPriceBN = new Web3Utils.BN(auction.beginPrice);
    const endPriceBN = new Web3Utils.BN(auction.endPrice);
    const szaboBN = new Web3Utils.BN(10e12);
    // Convert to Szabo (1 szabo = 10^12 wei, 1 ether = 10^6 szabo)
    // Not having to deal with large numbers makes this graph a lot easier/faster.
    const startPrice = startPriceBN.div(szaboBN).toNumber();
    const endPrice = endPriceBN.div(szaboBN).toNumber();

    const startTime = auction.beginTime;
    let currentTime = Date.now() / 1000;
    const endTime = auction.endTime;
    // check currentTime against auction limits, clip it
    if (currentTime < startTime) currentTime = startTime;
    if (currentTime > endTime) currentTime = endTime - 1;

    const duration = endTime - startTime;

    const descendingPrice = startPrice > endPrice;
    const maxPrice = descendingPrice ? startPrice : endPrice;
    const minPrice = descendingPrice ? endPrice : startPrice;
    let priceCeil = maxPrice + ((maxPrice - minPrice) * 0.3);
    let priceFloor = minPrice - ((maxPrice - minPrice) * 0.3);

    if (priceFloor < 0) priceFloor = 0;

    if (priceCeil - priceFloor < 0.0001) {
        priceCeil = priceFloor === 0 ? 1.0 : (priceFloor * 1.2);
        priceFloor = priceFloor === 0 ? 0.3 : (priceFloor * 0.8);
    }

    // converts a price to a value in range 0 to 1, with 0 being the top of the chart.
    const priceToRelY = (p) => 1.0 - (0.5 * (p / priceCeil)) - (0.5 * ((p - priceFloor) / (priceCeil - priceFloor)));

    // 0 is top for Y
    const startY = priceToRelY(startPrice);
    const endY = priceToRelY(endPrice);

    const currentX = (currentTime - startTime) / (endTime - startTime);
    const currentY = startY + ((endY - startY) * currentX);

    const elapsedColor = auctionType === "cozy" ? "#de77dd" : "#5ab1de";
    const futureColor = auctionType === "cozy" ? "#dea289" : "#7ade93";
    const chartColor = auctionType === "cozy" ? "#c18f6e" : "#73c18b";
    const highlightColor = auctionType === "cozy" ? "#c26963" : "#4db25a";

    const start = [chartMarginLeft, (startY * chartInnerHeight) + chartMarginTop];
    const current = [
        (currentX * chartInnerWidth) + chartMarginLeft,
        (currentY * chartInnerHeight) + chartMarginTop];
    const end = [
        chartInnerWidth + chartMarginLeft,
        (endY * chartInnerHeight) + chartMarginTop];

    const gridLineCount = 4;
    const gridLines = [];
    // Add all step portions, except 0.0, and 1.0.
    for (let i = 1; i < gridLineCount; i++) {
        gridLines.push(i / gridLineCount);
    }

    const elapsedChartPoly = `${start[0]},${start[1]} ${current[0]},${current[1]} ${current[0]},${chartInnerHeight + chartMarginTop} ${start[0]},${chartInnerHeight + chartMarginTop}`;
    const futureChartPoly = `${current[0]},${current[1]} ${end[0]},${end[1]} ${end[0]},${chartInnerHeight + chartMarginTop} ${current[0]},${chartInnerHeight + chartMarginTop}`;

    return (
        <svg className={classNames(classes.root, classes.chartText)} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            <defs>
                <linearGradient id="elapsed" x2="0" y2="1">
                    <stop offset="0" stopColor={elapsedColor} stopOpacity="0.65"/>
                    <stop offset="1" stopColor={elapsedColor} stopOpacity="0.3"/>
                </linearGradient>
                <linearGradient id="future" x2="0" y2="1">
                    <stop offset="0" stopColor={futureColor} stopOpacity="0.65"/>
                    <stop offset="1" stopColor={futureColor} stopOpacity="0.3"/>
                </linearGradient>
            </defs>

            { /* Chart gradient, in 2 parts: elapsed auction part, and future par */ }
            <polygon points={elapsedChartPoly} fill="url(#elapsed)"/>
            <polygon points={futureChartPoly} fill="url(#future)"/>

            { /* Chart outline */ }
            <rect x={chartMarginLeft} y={chartMarginTop}
                  width={chartInnerWidth} height={chartInnerHeight}
                  fill="none" stroke={chartColor} strokeWidth="2"/>

            { /* Grid lines */ }
            {gridLines.map((v, i) => (<line key={"grid-"+i} x1={(chartInnerWidth * v) + chartMarginLeft}
                                         x2={(chartInnerWidth * v) + chartMarginLeft}
                                         y1={chartMarginTop}
                                         y2={chartInnerHeight + chartMarginTop}
                                         stroke={chartColor} strokeWidth="1"/>))}

            { /* dashed separator */ }
            <line x1={current[0]} x2={current[0]}
                  y1={current[1]} y2={chartInnerHeight + chartMarginTop}
                  stroke={futureColor} strokeWidth="2" strokeDasharray="5,5"/>

            { /* Starting point */ }
            <circle cx={start[0]} cy={start[1]} r={chartPointR} fill={highlightColor}/>
            { /* Current point */ }
            <circle cx={current[0]} cy={current[1]} r={chartPointR} fill={highlightColor}/>
            { /* Ending point */ }
            <circle cx={end[0]} cy={end[1]} r={chartPointR} fill={chartColor}/>

            { /* Price info */ }
            <text className={classes.chartText} textAnchor="left"
                  x={end[0] + 8} y={start[1] + (fontSize * 0.5)}
                  fontSize={fontSize}>Ξ {Web3Utils.fromWei(auction.beginPrice, "ether")}</text>
            { /* If different enough from the start price, also show the end price */
                (Math.abs(start[1] - end[1]) > fontSize * 1.3) &&
                    <text className={classes.chartText} textAnchor="left"
                          x={end[0] + 8} y={end[1] + (fontSize * 0.5)}
                          fontSize={fontSize}>Ξ {Web3Utils.fromWei(auction.endPrice, "ether")}</text>
            }

            { /* Time info */ }
            { [0, ...gridLines, 1].map((p, i) =>
                (<text key={"time-info-"+i} className={classes.chartText} textAnchor="left"
                       x={p * chartInnerWidth + chartMarginLeft}
                       y={chartMarginTop + chartInnerHeight + fontSize + 5}
                       fontSize={fontSize}>{formatTime(startTime + (p * (endTime - startTime)), duration)}</text>))
            }

        </svg>)

};

const StyledPepeAuctionChart = withStyles(styles)(PepeAuctionChart);

const ConnectedPepeAuctionChart  = connect((state, props) => {
    // Get the right auction data
    const auctionData = props.auctionType === "sale" ? state.pepe.saleAuctions[props.pepeId] : state.pepe.cozyAuctions[props.pepeId];
    return ({
        auctionData: (auctionData && (auctionData.web3 || auctionData.api)) || {}
    });
})(StyledPepeAuctionChart);

export default ConnectedPepeAuctionChart;

