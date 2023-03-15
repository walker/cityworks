import ReversibleMap from 'reversible-map';
/**
 * A plugin that contains "comments" methods
 */
export declare class Comments {
    /**
     * @hidden
     */
    cw: any;
    /**
     * Storage of all potential activity types which comments can be attached to: Unknown, Request, WorkOrder, CaTask, CaObject, CaCorrection, Project, Contract
     */
    activityTypes: ReversibleMap<string, number>;
    /**
     * Storage of object's active activityType
     */
    currentActivityType: string;
    /**
     * @hidden
     */
    constructor(cw: any, activityType: string);
    /**
     * Add a comment - for adding a comment to an object when the object is already known. Always call comment.add from request, case, workorder, or inspection.
     *
     * @param {number} sid - The SID of the activity to which the comment should be attached
     * @param {string} comment - The text for the comment
     * @return {Object} Returns a Promise which represents a CommentRecord object
     */
    add(sid: number, comment: string): Promise<unknown>;
    /**
     * Update a comment
     *
     * @param {number} id - The ID of the comment which should be updated
     * @param {string} comment - The new text for the updated comment
     * @return {Object} Returns a Promise which represents a CommentRecord object
     */
    update(id: number, comment: string): Promise<unknown>;
    /**
     * Get comments for activity items
     *
     * @param {Array<number>} sids - The options SIDs to get comments for.
     * @return {Object} Returns Promise object that represents a collection of available comments
     */
    get(sids: Array<number>): Promise<unknown>;
    /**
     * Get pre-defined comments for activityTypes
     *
     * @param {number} problemSid - The ProblemSid if currentActivityType is (Service) Request
     * @param {string} [category] - Only applies to WorkOrder and ServiceRequest category comments.
     * @return {Object} Returns Promise object that represents a collection of available comment templates.
     */
    getPredefined(problemSid?: number, category?: string): Promise<unknown>;
}
