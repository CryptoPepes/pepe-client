/**
 * Builds ES6 Map from object.
 * @param obj input
 * @return {Map<any, any>} output.
 */
function buildMap(obj) {
    if (obj === undefined) return undefined;
    let map = new Map();
    Object.keys(obj).forEach(key => {
        map.set(key, obj[key]);
    });
    return map;
}

export {buildMap};