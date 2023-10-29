/**
 * A plugin that contains "general" methods for a Cityworks install
 */
export declare class General {
    /**
     * @hidden
     */
    cw: any;
    /**
     * @hidden
     */
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
     * Get CwMetatData by Type and CwSid
     *
     * @param {Array<number>} Ids
     * @param {string} TableName - INSPECTION, REQUEST, WORKORDER require View permission on the activities
     * @return {Object} Returns Promise object that represents a
     */
    getActivityMetadataByIds(ids: Array<number>, table: string): Promise<unknown>;
    /**
     * Get recent history for authenticated user
     *
     * @return {Object} Returns Promise object that represents a collection of RecentActivity objects
     */
    getHistory(): Promise<unknown>;
    /**
     * Get cost summary for WorkOrder entities
     *
     * @param {Array<number>} ObjectIds
     * @return {Object} Returns Promise object that represents a
     */
    getWOEntityCostSummary(object_ids: Array<number>): Promise<unknown>;
    /**
     * Get cost summary for WorkOrder entities selected through a search definition
     *
     * @param {number} SearchId - Search Definition Id
     * @return {Object} Returns Promise object that represents a
     */
    searchWOEntityCostSummary(search_id: number): Promise<unknown>;
    /**
     * Get Holidays
     *
     * @param {Date} startDate - Date to search for Holidays, including this date.
     * @param {Date} [endDate] - If not specified, Holidays _on_ startDate are returned. If specified, Holidays on startDate up to, but not including endDate are returned.
     * @return {Object} Returns Promise object that represents a list of the holiday(s) found
     */
    getHolidays(startDate: Date, endDate?: Date): Promise<unknown>;
    /**
     * Add Holidays
     *
     * @param {Date} holiday - The holiday's date
     * @param {string} description - The holiday's name/description
     * @return {Object} Returns Promise object that represents a
     */
    addHolidays(holiday: Date, description: string): Promise<unknown>;
    /**
     * Delete Holidays
     *
     * @param {Array<Date>} holidays - List of datetimes which should have holidays deleted
     * @return {Object} Returns Promise object that represents a
     */
    deleteHolidays(holidays: Array<Date>): Promise<unknown>;
}
