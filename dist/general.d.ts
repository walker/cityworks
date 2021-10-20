/**
 * A plugin that contains "general" methods for a Cityworks install
 */
export declare class General {
    cw: any;
    constructor(cw: any);
    /**
     * Get notifications for currently authenticated user
     *
     * @return {Object} Returns Promise object that represents a collection of available notifications
     */
    notifications(): Promise<unknown>;
    /**
     * Find out if the current user is watching a particular activity (case, task, null [as a string])
     *
     * @param {string} activityType - which activity type the following ID will be for.
     * @param {number} activityId - activity Case or CaseTask (task instance) ID to check
     * @return {Object} Returns Promise object that represents a boolean indicating the currently authenticated user is watching the provided activity
     */
    amIWatching(activityType: any, activityId: number): Promise<unknown>;
    /**
     * Do a "quick" search for any string (an ID is best)
     *
     * @param {string} text - text to search the system for
     * @return {Object} Returns Promise object that represents a collection of the currently authenticated user's notifications
     */
    quickSearch(text: string): Promise<unknown>;
    /**
     * Get CwMetatData by Type and CwSid
     *
     * @param {Array<number>} Ids
     * @param {string} TableName - INSPECTION, REQUEST, WORKORDER require View permission on the activities
     * @return {Object} Returns Promise object that represents a
     */
    getActivityMetadataByIds(ids: Array<number>, table: string): Promise<unknown>;
    /**
     * Get cost summary for work order entities
     *
     * @param {Array<number>} ObjectIds
     * @return {Object} Returns Promise object that represents a
     */
    getWOEntityCostSummary(object_ids: Array<number>): Promise<unknown>;
    /**
     * Get cost summary for work order entities selected through a search definition
     *
     * @param {number} SearchId - Search Definition Id
     * @return {Object} Returns Promise object that represents a
     */
    searchWOEntityCostSummary(search_id: number): Promise<unknown>;
}
