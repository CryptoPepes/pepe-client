/**
 * Searches the web3 accounts object and checks if it contains the given "lookingForAddress"
 */
const hasAccount = (accountsObj, lookingForAddress) => {
    if (!accountsObj) return false;
    if (!lookingForAddress) return false;

    const lookingLower = lookingForAddress.toLowerCase();

    // All keys of accountsObj (produced by redapp reducer most of the time) are lower-case
    return !!(accountsObj[lookingLower]);
};

const getDefaultAccount = (accountsObj) => {
    if (!accountsObj) return undefined;

    const addresses = Object.keys(accountsObj);
    if (addresses && addresses.length >= 1) return addresses[0];
    else return false;
};

// Address format: prefixed with 0x, always 40 digits Mixed case, hex.
const addressRegex = /^0x[0-9a-fA-F]{40}$/;

const isValidAccountAddress = (address) => !!address && addressRegex.test(address);

export {hasAccount, getDefaultAccount, isValidAccountAddress};
