class Query {

    /**
     * Builds a search query.
     * @param cursor Optional. Pointer to the database index position to continue from, for infinite scrolling.
     * @param limit Optional. Limited in backend, defaults to 20.
     * @param listingType Optional. The type of listing. default to all. "cozy" = hopping/cozy auction. "sale" = pepe auction.
     * @param owner Optional. The owner address of the pepe.
     * @param cozySeller Optional. The seller address of the pepe that is being sold.
     * @param saleSeller Optional. The seller address of the pepe that is offered for cozy time.
     * @param cooldownIndex Optional. The cooldown stage.
     * @param props Optional. List of pepe-properties to filter for.
     * @param sort Optional. Sorting order.
     * @param pepeState Optional. Filters results based on the state of the pepe. (In an auction, expired, cooldown, etc.)
     * @param displayName Optional. The name of the pepe. Will be padded with "\u0000" by backend, then compared with actual name in blockchain.
     * @param mother Optional. Pepe-id of the mother. Must be hex-formatted, lowercase, no-prefix.
     * @param father Optional. Pepe-id of the father, formatted like the mother pepe-id.
     * @param gen Optional. Filter for a particular generation of pepes.
*/
    static buildQuery({
                          cursor, limit, listingType, owner, cozySeller, saleSeller, cooldownIndex,
                          props = [], sort, pepeState, displayName, mother, father, gen
                      }) {
        //well, it's represented with just a map, but constructing it with a function encapsulates the parameter naming scheme.
        const query = new Map();
        if (cursor !== undefined) query.set("cursor", encodeURIComponent(cursor));
        if (limit !== undefined) query.set("limit", limit);
        if (listingType !== undefined) query.set("listing-type", listingType);
        if (owner !== undefined) query.set("owner", owner);
        if (cozySeller !== undefined) query.set("cozy-seller", cozySeller);
        if (saleSeller !== undefined) query.set("sale-seller", saleSeller);
        if (cooldownIndex !== undefined) query.set("cooldown", cooldownIndex);
        if (props !== undefined && props.length > 0) query.set("props", props.join(","));
        if (sort !== undefined) query.set("sort", sort);
        if (pepeState !== undefined) query.set("pepe-state", pepeState);
        if (displayName !== undefined) query.set("name", encodeURIComponent(displayName));
        if (mother !== undefined) query.set("mother", mother);
        if (father !== undefined) query.set("father", father);
        if (gen !== undefined) query.set("gen", gen);
        return new Query(query);
    }

    /**
     * Convert query url string to parsed Query object.
     * @param queryString
     * @return {Query}
     */
    static queryStringToQuery(queryString) {
        const query = new Map();
        const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split('=');
            if(pair[0] === "props") {
                pair[1] = decodeURIComponent(pair[1] || '').split(",");
                query.set(pair[0], pair[1]);
            } else {
                query.set(pair[0], decodeURIComponent(pair[1] || ''));
            }
        }
        return new Query(query);
    }

    /**
     * Constructor to make a Query from a raw map. Consider to use `buildQuery` instead.
     * @param {Map} innerMap The raw query contents.
     */
    constructor(innerMap) {
        this.query = innerMap
    }

    /**
     * Makes a copy of the full query.
     * @returns {Query} the copy.
     */
    getCopy() {
        return new Query(new Map(this.query));
    }

    getCursor() {
        return decodeURIComponent(this.query.get("cursor"));
    }

    /**
     * Changes the cursor parameter.
     * @param newCursor The new cursor.
     */
    changeCursor(newCursor) {
        if (!newCursor) this.query.delete("cursor");
        else this.query.set("cursor", encodeURIComponent(newCursor));
    }

    getName() {
        const name = this.query.get("name");
        if (name === null || name === undefined) return undefined;
        return decodeURIComponent(name);
    }

    /**
     * Changes the display name parameter
     * @param displayName The new name.
     */
    changeName(displayName) {
        if (displayName === null || displayName === undefined) this.query.delete("name");
        else this.query.set("name", encodeURIComponent(displayName));
    }

    getOwner() {
        return this.query.get("owner");
    }

    /**
     * Change the owner filter. Contracts count as owners, but use listingType to specify that
     *  a specific contract should be used as owner.
     * This "owner" var is translated to a cozy/sale-seller parameter when listingType requires it.
     * @param ownerAddress Address of the owner.
     */
    changeOwner(ownerAddress) {
        if (!ownerAddress) this.query.delete("owner");
        else this.query.set("owner", ownerAddress);
    }

    getCozySeller() {
        return this.query.get("cozy-seller");
    }

    // Only use this in special situations. Preferred way: set owner, and set listingType to "cozy"
    changeCozySeller(addr) {
        if (!addr) this.query.delete("cozy-seller");
        else this.query.set("cozy-seller", addr);
    }

    getSaleSeller() {
        return this.query.get("sale-seller");
    }

    // Only use this in special situations. Preferred way: set owner, and set listingType to "sale"
    changeSaleSeller(addr) {
        if (!addr) this.query.delete("sale-seller");
        else this.query.set("sale-seller", addr);
    }

    getListingType() {
        return this.query.get("listing-type");
    }

    changeListingType(listingType) {
        if (!listingType) this.query.delete("listing-type");
        else this.query.set("listing-type", listingType);
    }

    getPepeState() {
        return this.query.get("pepe-state");
    }

    changePepeState(pepeState) {
        if (!pepeState) this.query.delete("pepe-state");
        else this.query.set("pepe-state", pepeState);
    }

    getGen() {
        return this.query.get("gen");
    }

    changeGen(gen) {
        if (gen === QueryHelper.defaultGen) this.query.delete("gen");
        else this.query.set("gen", gen);
    }

    getMother() {
        return this.query.get("mother");
    }

    changeMother(motherId) {
        // check for falsy, except the cases "0" and 0
        if (motherId !== 0 && motherId !== "0" && !!motherId) this.query.delete("mother");
        else this.query.set("mother", motherId);
    }

    getFather() {
        return this.query.get("father");
    }

    changeFather(fatherId) {
        // check for falsy, except the cases "0" and 0
        if (fatherId !== 0 && fatherId !== "0" && !!fatherId) this.query.delete("father");
        else this.query.set("father", fatherId);
    }

    getOrder() {
        return this.query.get("sort");
    }

    changeOrder(sort) {
        if (sort === QueryHelper.defaultSortOrder) this.query.delete("sort");
        else this.query.set("sort", sort);
    }

    getCooldown() {
        return this.query.get("cooldown");
    }

    changeCooldown(cooldown) {
        if (cooldown === QueryHelper.defaultCooldown) this.query.delete("cooldown");
        else {
            this.query.set("cooldown", cooldown);
        }
    }

    setPropsCallback(fn) {
        this.propsCallback = fn;
    }

    // NOTE: this does not retrieve props from special props callback,
    //  it simply loads it from the query itself. Use for initial loading only.
    getProps() {
        return this.query.get("props");
    }

    changeProps(props) {
        if (props === "" || !(props instanceof Array) || props.length <= 0) this.query.delete("props");
        else {
            this.query.set("props", props.join(","));
        }
    }

    /**
     * Converts the query to a parameter-set string.
     * @returns {string}
     */
    toURLParamStr() {
        // properties are loaded on compile-time, to not have to maintain a mirror of the whole property filter data-structure.
        if (this.propsCallback) this.propsCallback();
        //default to none
        if (this.query && this.query.size > 0) return "?" + Array.from(this.query).map(([k, v]) => k + "=" + v).join("&");
        else return "";
    }

}

class QueryHelper {

    static sortOrders = {
        normal: [
            "newest-first",
            "oldest-first",
            "fast-cozy-again-first",
            "slow-cozy-again-first"
        ],
        sale: [
            "newest-first",
            "oldest-first",
            "high-pepe-begin-price-first",
            "low-pepe-begin-price-first",
            "high-pepe-end-price-first",
            "low-pepe-end-price-first",
            "fast-cozy-again-first",
            "slow-cozy-again-first"
        ],
        cozy: [
            "newest-first",
            "oldest-first",
            "high-cozy-begin-price-first",
            "low-cozy-begin-price-first",
            "high-cozy-end-price-first",
            "low-cozy-end-price-first"
        ]
    };

    static defaultSortOrder = "newest-first";

    static genOptions = [
        "", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"
    ];

    static defaultGen = "";

    static coolDownOptions = [
        "", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"
    ];

    static defaultCooldown = "";
}

export {Query, QueryHelper};
