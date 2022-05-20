import ReversibleMap from 'reversible-map';
/**
 * ActivityLink interface for ActivityLinks
 *
 */
export interface ActivityLink {
    linkTypes: ReversibleMap<string, number>;
    activityTypes: ReversibleMap<string, number>;
    cw: any;
}
/**
 * ActivityLinks implements the activity link functions via using the ActivityLink interface
 *
 */
export declare class ActivityLinks implements ActivityLink {
    /**
     * Activity types to map string to number for internal use. Activity types available are:
     *
     *      "null", "case", "inspection", "request", "workorder", "wipcase"
     */
    activityTypes: ReversibleMap<string, number>;
    /**
     * Link types to map string to number for internal use. Link types available are:
     *
     *      "null", "parent", "related"
     */
    linkTypes: ReversibleMap<string, number>;
    /**
     * @hidden
     */
    cw: any;
    /**
     * @hidden
     */
    constructor(cw: any);
    /**
     * Create a new activity link between two items.
     *
     * @param {string} source_type - Source type as string. Options:
     *
     *      "null", "case", "inspection", "request", "workorder", "wipcase"
     *
     * @param {number} source_sid - Source SID (numeric ID) one wishes to remove a link between SID as source and a particular destination
     * @param {string} destination_type - Destination type as string
     *
     *      "null", "case", "inspection", "request", "workorder", "wipcase"
     *
     * @param {number} destination_sid - Destination SID (numeric ID) one wishes to remove a link between SID as destination and a particular source
     * @param {string} link_type - The type of link which exists between provided source and destination. Defaults to `related`. Options:
     *
     *      "null", "parent", "related"
     *
     * @return {Object} Returns Promise object that represents a
     */
    add(source_type: string, source_sid: number, destination_type: string, destination_sid: number, link_type?: string): Promise<unknown>;
    /**
     * Get the links for a particular node type by ID.
     *
     * @param {string} type - Source type as string. Options:
     *
     *      "null", "case", "inspection", "request", "workorder", "wipcase"
     *
     * @param {Array<number>} sids - Array of numeric (S)IDs you wish to get of the specified type
     * @return {Object} Returns Promise object that represents a collection
     */
    get(type: string, sids: Array<number>): Promise<unknown>;
    /**
     * Clone a current activity link.
     *
     * @param {string} source_type - Source type as string. Options:
     *
     *      "null", "case", "inspection", "request", "workorder", "wipcase"
     *
     * @param {number} source_sid - Source SID (numeric ID) one wishes to clone a link between SID as source and a particular destination
     * @param {string} destination_type - Destination type as string
     *
     *      "null", "case", "inspection", "request", "workorder", "wipcase"
     *
     * @param {number} destination_sid - Destination SID (numeric ID) one wishes to clone a link between SID as destination and a particular source
     * @return {Object} Returns Promise object that represents a
     */
    clone(source_type: string, source_sid: number, destination_type: string, destination_sid: number): Promise<unknown>;
    /**
     * Delete an activity link by ID
     *
     * @param {number} activity_link_id - The ID of the activity link one wishes to delete
     * @return {Object} Returns Promise object that represents a
     */
    delete(activity_link_id: number): Promise<unknown>;
    /**
     * Remove a link by specifying everything.
     *
     * @param {string} source_type - Source type as string. Options:
     *
     *      "null", "case", "inspection", "request", "workorder", "wipcase"
     *
     * @param {number} source_sid - Source SID (numeric ID) one wishes to remove a link between SID as source and a particular destination
     * @param {string} destination_type - Destination type as string
     *
     *      "null", "case", "inspection", "request", "workorder", "wipcase"
     *
     * @param {number} destination_sid - Destination SID (numeric ID) one wishes to remove a link between SID as destination and a particular source
     * @param {string} link_type - The type of link which exists between provided source and destination. Defaults to `related`. Options:
     *
     *      "null", "parent", "related"
     *
     * @return {Object} Returns Promise object that represents a
     */
    remove(source_type: string, source_sid: number, destination_type: string, destination_sid: number, link_type?: string): Promise<unknown>;
}
