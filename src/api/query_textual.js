import propertyMappings from "./property_mappings.json";
import {buildMap} from "../util/collection";

class QueryTextual {

    static sortTextual = {
        "newest-first": "Newest first",
        "oldest-first": "Oldest first",
        "high-pepe-begin-price-first": "Most expensive pepe first [begin price]",
        "low-pepe-begin-price-first": "Cheapest pepe first [begin price]",
        "high-pepe-end-price-first": "Most expensive pepe first [end price]",
        "low-pepe-end-price-first": "Cheapest pepe first [end price]",
        "high-cozy-begin-price-first": "Most expensive Cozy time first [begin price]",
        "low-cozy-begin-price-first": "Cheapest Cozy time first [begin price]",
        "high-cozy-end-price-first": "Most expensive Cozy time first [end price]",
        "low-cozy-end-price-first": "Cheapest Cozy time first [end price]",
        "fast-cozy-again-first": "Quick cozy ready first",
        "slow-cozy-again-first": "Late cozy ready first"
    };

    static genTextual = {
        "": "Any",
        "0": "Gen 0", "1": "Gen 1", "2": "Gen 2", "3": "Gen 3",
        "4": "Gen 4", "5": "Gen 5", "6": "Gen 6", "7": "Gen 7",
        "8": "Gen 8", "9": "Gen 9", "10": "Gen 10", "11": "Gen 11",
        "12": "Gen 12", "13": "Gen 13", "14": "Gen 14", "15": "Gen 15"
    };

    static cooldownTextual = {
        "": "Any",
        "0": "1 minute",
        "1": "2 minutes",
        "2": "5 minutes",
        "3": "15 minutes",
        "4": "30 minutes",
        "5": "45 minutes",
        "6": "1 hour",
        "7": "2 hours",
        "8": "4 hours",
        "9": "8 hours",
        "10": "16 hours",
        "11": "1 days",
        "12": "2 days",
        "13": "4 days",
        "14": "7 days"
    };

    static getSortText(sortId) {
        //only English for now.
        return QueryTextual.sortTextual[sortId] || "Unknown sort order"
    }

    static getGenText(genId) {
        //only English for now.
        return QueryTextual.genTextual[genId] || "-"
    }

    static getCooldownText(cooldownId) {
        //only English for now.
        return QueryTextual.cooldownTextual[cooldownId] || "-"
    }

    /**
     * Get the id for the given prop-name (case insensitive). May return undefined.
     * @param {string} propName the name find an id for.
     * @return {string|undefined} The id. Returns undefined when not available.
     */
    static getPropertyIdByName(propName) {
        if (propName === undefined) return undefined;
        // should support other languages when available
        return propertyMappings["name2id"][propName.toLowerCase()]
    }

    /**
     * Get the name for the given prop-id. May return undefined.
     * @param {string} id the id find a name for.
     * @return {string|undefined} The name. Returns undefined when not available.
     */
    static getPropertyNameById(id) {
        if (id === undefined) return undefined;
        // should support other languages when available
        return propertyMappings["id2name"][id]
    }

    /**
     * Get a mapping of all available properties, with their display names as values.
     * @returns {Map<string, string>} The mapping.
     */
    static getPepePropertiesMap() {
        // return the English map for now, should switch data when other languages are available.
        return buildMap(propertyMappings["id2name"])
    }

}

export default QueryTextual