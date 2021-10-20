export declare class MessageQueue {
    cw: any;
    status: Object;
    hook_types: Object;
    /**
     * Construct activity link object for Message Queue function
     *
     * @param {object} cw - Feed in the cityworks object instance so that this instance has access to the runRequest from the recursively-linked Cityworks instance
     * @return {Object} Returns object that is this module
     */
    constructor(cw: any);
    /**
     * Process Webhook MessageQueue records by MessageQueueId
     *
     * @param {Array<number>} [ids] - List of MessageQueueId values
     * @param {boolean} [delete_successful] - automatically delete messages that complete with successful execution, default is false
     * @return {Array<>} Returns Promise object that represents a collection of QueueMessages which have been processed
     */
    processMessages(ids: Array<number>, delete_successful?: boolean): Promise<unknown>;
    /**
     * Get Messages specified in list of MessageQueueIds
     *
     * @param {Array<number>} ids - List of MessageQueueId values
     * @param {string} status -
     * @param {number} [maxcount] - Maximum number returned. Defaults to 15
     * @return {Array<>} Returns Promise object that represents a collection of QueueMessages which have been processed
     */
    get(ids: Array<number>, status: string, maxcount?: number): Promise<unknown>;
    /**
     * Delete Messages specified in list of MessageQueueIds
     *
     * @param {Array<number>} ids - List of MessageQueueId values
     * @param {string} status - automatically delete messages that complete with successful execution, default is false
     * @param {number} [hours_to_keep] - utomatically delete messages that complete with successful execution, default is false
     * @return {Array<>} Returns Promise object that represents a collection of QueueMessages which have been processed
     */
    delete(ids: Array<number>, status: string, hours_to_keep?: number): Promise<unknown>;
    preferences(): Promise<unknown>;
    search(parameters: any, max_results?: number): Promise<unknown>;
    /**
     * Update queue message
     *
     * @param {Object} parameters - Provide allowed parameters:
     *
     *      {
     *        HookId: number,
     *        Id: number,
     *        Packet: string,
     *        Result: string,
     *        Status: string, // Available options: Pending, Processing, Complete, Failed
     *        HookType: string // Available options: Unknown, ActivityUpdate, Email, WebHook
     *      }
     *
     * @return {Object} Returns Promise object that represents an Object with the desired GIS service definitions
     */
    update(parameters: any): Promise<unknown>;
    updateMessageStatus(ids: number[], status: string, hours_to_keep?: number): Promise<unknown>;
    getWebooks(hook_ids: any): Promise<unknown>;
}
