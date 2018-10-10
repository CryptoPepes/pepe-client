
import {cpepAddr, cozyAddr, saleAddr} from "../web3Settings";
import CPEP_abi from '../abi/CPEP_abi.json';
import sale_abi from '../abi/sale_abi.json';
import cozy_abi from '../abi/cozy_abi.json';

function decodeTxInput(input, contractABI) {

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
        const decoded = decodeTxInput(input, CPEP_abi);
        console.log("Decoded tx input: ", decoded);
        if (decoded === null) return null;
        switch (decoded.name) {
            case "transfer": return {
                type: 'transfer',
                from: fromAddr,
                to: decoded.params['_to'],
                pepeId: decoded.params['_tokenId']
            };
            case "cozyTime": return {
                type: 'breed',
                from: fromAddr,
                to: decoded.params['_pepeReceiver'],
                motherPepeId: decoded.params['_mother'],
                fatherPepeId: decoded.params['_father']
            };
            case "setPepeName": return {
                type: 'namePepe',
                from: fromAddr,
                pepeId: decoded.params['_pepeId'],
                nameHex: decoded.params['_name']
            };
            case "claimUsername": return {
                type: 'claimUsername',
                from: fromAddr,
                nameHex: decoded.params['_username']
            };
            case "transferAndAuction": return {
                type: (decoded.params['_auction'] === saleAddr) ? 'startSaleAuction' : 'startCozyAuction',
                from: fromAddr,
                pepeId: decoded.params['_pepeId'],
                beginPrice: decoded.params['_beginPrice'],
                endPrice: decoded.params['_endPrice'],
                startBlock: txReceipt['blockNumber'],
                duration: decoded.params['_duration']
            };
            case "approveAndBuy": return {
                type: (decoded.params['_auction'] === saleAddr) ? 'buyPepe' : 'buyCozy',
                from: fromAddr,
                pepeId: decoded.params['_pepeId'],
                bidPrice: txReceipt['value'],
                cozyCandidate: decoded.params['_cozyCandidate'],
                candidateAsFather: decoded.params['_candidateAsFather'],
                pepeReceiver: fromAddr,
                affiliate: null
            };
            case "approveAndBuyAffiliated": return {
                type: (decoded.params['_auction'] === saleAddr) ? 'buyPepe' : 'buyCozy',
                from: fromAddr,
                pepeId: decoded.params['_pepeId'],
                bidPrice: txReceipt['value'],
                cozyCandidate: decoded.params['_cozyCandidate'],
                candidateAsFather: decoded.params['_candidateAsFather'],
                pepeReceiver: fromAddr,
                affiliate: decoded.params['_affiliate']
            };
            case "approve": return {
                type: 'approve',
                from: fromAddr,
                to: decoded.params['_to'],
                pepeId: decoded.params['_tokenId']
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
        const decoded = decodeTxInput(input, cozy_abi);
        if (decoded === null) return null;
        switch (decoded.name) {
            case "buyCozy": return {
                type: 'buyCozy',
                from: fromAddr,
                pepeId: decoded.params['_pepeId'],
                bidPrice: txReceipt['value'],
                cozyCandidate: decoded.params['_cozyCandidate'],
                candidateAsFather: decoded.params['_candidateAsFather'],
                pepeReceiver: decoded.params['_pepeReceiver'],
                affiliate: null
            };
            case "buyCozyAffiliated": return {
                type: 'buyCozy',
                from: fromAddr,
                pepeId: decoded.params['_pepeId'],
                bidPrice: txReceipt['value'],
                cozyCandidate: decoded.params['_cozyCandidate'],
                candidateAsFather: decoded.params['_candidateAsFather'],
                pepeReceiver: decoded.params['_pepeReceiver'],
                affiliate: decoded.params['_affiliate']
            };
            case "startAuction": return {
                type: 'startCozyAuction',
                auctionType: 'cozy',
                from: fromAddr,
                pepeId: decoded.params['_pepeId'],
                beginPrice: decoded.params['_beginPrice'],
                endPrice: decoded.params['_endPrice'],
                startBlock: txReceipt['blockNumber'],
                duration: decoded.params['_duration']
            };
            case "savePepe": return {
                type: 'savePepe',
                auctionType: 'cozy',
                from: fromAddr,
                pepeId: decoded.params['_pepeId'],
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
        const decoded = decodeTxInput(input, sale_abi);
        if (decoded === null) return null;
        switch (decoded.name) {
            case "buyPepe": return {
                type: 'buyPepe',
                from: fromAddr,
                pepeId: decoded.params['_pepeId'],
                bidPrice: txReceipt['value'],
                affiliate: null
            };
            case "buyPepeAffiliated": return {
                type: 'buyPepe',
                from: fromAddr,
                pepeId: decoded.params['_pepeId'],
                bidPrice: txReceipt['value'],
                affiliate: decoded.params['_affiliate']
            };
            case "startAuction": return {
                type: 'startSaleAuction',
                auctionType: 'sale',
                from: fromAddr,
                pepeId: decoded.params['_pepeId'],
                beginPrice: decoded.params['_beginPrice'],
                endPrice: decoded.params['_endPrice'],
                startBlock: txReceipt['blockNumber'],
                duration: decoded.params['_duration'],
            };
            case "savePepe": return {
                type: 'savePepe',
                auctionType: 'sale',
                from: fromAddr,
                pepeId: decoded.params['_pepeId']
            };
            default: return null;
        }
    } catch (e) {
        console.log("Could not decode Sale Auction tx.", e);
        return null;
    }
}

function decodeTx(txReceipt) {
    // Tx receipt may not be available yet.
    if (!txReceipt) return null;
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

export default decodeTx;
