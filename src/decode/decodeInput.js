
import {cpepAddr, cozyAddr, saleAddr} from "../web3Settings";
import CPEP_abi from '../abi/CPEP_abi.json';
import sale_abi from '../abi/sale_abi.json';
import cozy_abi from '../abi/cozy_abi.json';

function decodeInput(input, contractABI) {

    const web3 = window.pepeWeb3v1;
    if (!web3) return null;

    if (!input) return null;
    if (input.startsWith("0x")) input = input.substring(2);
    if (input.length < 8) return null;

    // From web3js docs: "The first four bytes of the call data for a function call specifies the function to be called"
    const functionSignature = input.substring(0, 8);
    let abi = null;
    for (let i = 0; i < contractABI.length; i++) {
        const methodABI = contractABI[i];
        if (methodABI.sign === functionSignature) {
            // Found it!
            abi = methodABI;
            break;
        }
    }

    if (abi === null || !abi.inputs) return null;

    if (abi.inputs.length === 0) {
        return {
            name: abi.name,
            params: []
        }
    } else {
        const params = web3.eth.abi.decodeParameters(abi.inputs, input.substring(8));
        return {
            name: abi.name,
            params
        }
    }
}

function decodeCPEPTx(txReceipt) {
    const fromAddr = txReceipt.from;
    const input = txReceipt.input;
    try {
        const decoded = decodeInput(input, CPEP_abi);
        if (decoded === null) return null;
        switch (decoded.name) {
            case "transfer": return {
                type: 'transfer',
                from: fromAddr,
                to: decoded['_to'],
                pepeId: decoded['_tokenId']
            };
            case "cozyTime": return {
                type: 'breed',
                from: fromAddr,
                to: decoded['_pepeReceiver'],
                mother: decoded['_mother'],
                father: decoded['_father']
            };
            case "setPepeName": return {
                type: 'namePepe',
                from: fromAddr,
                pepeId: decoded['_pepeId'],
                name: decoded['_name'] // TODO maybe decode bytes into string? Instead of in UI?
            };
            case "claimUsername": return {
                type: 'claimUsername',
                from: fromAddr,
                name: decoded['_username'] // TODO maybe decode bytes into string? Instead of in UI?
            };
            case "transferAndAuction": return {
                type: 'startAuction',
                auctionType: (decoded['_auction'] === saleAddr) ? 'sale' : 'cozy',
                from: fromAddr,
                pepeId: decoded['_pepeId'],
                beginPrice: decoded['_beginPrice'],
                endPrice: decoded['_endPrice'],
                startBlock: txReceipt['blockNumber'],
                duration: decoded['_duration']
            };
            case "approveAndBuy": return {
                type: (decoded['_auction'] === saleAddr) ? 'buyPepe' : 'buyCozy',
                from: fromAddr,
                pepeId: decoded['_pepeId'],
                cozyCandidate: decoded['_cozyCandidate'],
                candidateAsFather: decoded['_candidateAsFather'],
                pepeReceiver: fromAddr,
                affiliate: null
            };
            case "approveAndBuyAffiliated": return {
                type: (decoded['_auction'] === saleAddr) ? 'buyPepe' : 'buyCozy',
                from: fromAddr,
                pepeId: decoded['_pepeId'],
                cozyCandidate: decoded['_cozyCandidate'],
                candidateAsFather: decoded['_candidateAsFather'],
                pepeReceiver: fromAddr,
                affiliate: decoded['_affiliate']
            };
            case "approve": return {
                type: 'approve',
                from: fromAddr,
                to: decoded['_to'],
                pepeId: decoded['_tokenId']
            };
            default: return null;
        }
    } catch (e) {
        console.log("Could not decode CPEP tx.", e);
        return null;
    }
}

function decodeCozyTx(txReceipt) {
    const fromAddr = txReceipt.from;
    const input = txReceipt.input;
    try {
        const decoded = decodeInput(input, cozy_abi);
        if (decoded === null) return null;
        switch (decoded.name) {
            case "buyCozy": return {
                type: 'buyCozy',
                from: fromAddr,
                pepeId: decoded['_pepeId'],
                cozyCandidate: decoded['_cozyCandidate'],
                candidateAsFather: decoded['_candidateAsFather'],
                pepeReceiver: decoded['_pepeReceiver'],
                affiliate: null
            };
            case "buyCozyAffiliated": return {
                type: 'buyCozy',
                from: fromAddr,
                pepeId: decoded['_pepeId'],
                cozyCandidate: decoded['_cozyCandidate'],
                candidateAsFather: decoded['_candidateAsFather'],
                pepeReceiver: decoded['_pepeReceiver'],
                affiliate: decoded['_affiliate']
            };
            case "startAuction": return {
                type: 'startAuction',
                auctionType: 'cozy',
                from: fromAddr,
                pepeId: decoded['_pepeId'],
                beginPrice: decoded['_beginPrice'],
                endPrice: decoded['_endPrice'],
                startBlock: txReceipt['blockNumber'],
                duration: decoded['_duration']
            };
            case "savePepe": return {
                type: 'savePepe',
                from: fromAddr,
                pepeId: decoded['_pepeId'],
            };
            default: return null;
        }
    } catch (e) {
        console.log("Could not decode Cozy Auction tx.", e);
        return null;
    }
}

function decodeSaleTx(txReceipt) {
    const fromAddr = txReceipt.from;
    const input = txReceipt.input;
    try {
        const decoded = decodeInput(input, sale_abi);
        if (decoded === null) return null;
        switch (decoded.name) {
            case "buyPepe": return {
                type: 'buyPepe',
                from: fromAddr,
                pepeId: decoded['_pepeId'],
                affiliate: null
            };
            case "buyPepeAffiliated": return {
                type: 'buyPepe',
                from: fromAddr,
                pepeId: decoded['_pepeId'],
                affiliate: decoded['_affiliate']
            };
            case "startAuction": return {
                type: 'startAuction',
                auctionType: 'sale',
                from: fromAddr,
                pepeId: decoded['_pepeId'],
                beginPrice: decoded['_beginPrice'],
                endPrice: decoded['_endPrice'],
                startBlock: txReceipt['blockNumber'],
                duration: decoded['_duration'],
            };
            case "savePepe": return {
                type: 'savePepe',
                from: fromAddr,
                pepeId: decoded['_pepeId']
            };
            default: return null;
        }
    } catch (e) {
        console.log("Could not decode Sale Auction tx.", e);
        return null;
    }
}

function decode(txReceipt) {
    switch (txReceipt.to) {
        case cpepAddr:
            return decodeCPEPTx(txReceipt);
        case cozyAddr:
            return decodeCozyTx(txReceipt);
        case saleAddr:
            return decodeSaleTx(txReceipt);
        default:
            return null;
    }
}

export default decode;
