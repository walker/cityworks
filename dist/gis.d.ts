export declare class Gis {
    /**
     * @hidden
     */
    cw: any;
    /**
     * @hidden
     */
    constructor(cw: any);
    /**
     * Get gis service configuration for user, group, domain, or service id
     *
     * @param {string} [whichType] - domain, group, mapservice, or user
     * @param {number} [whichId] - domain, group, mapservice, or user Id
     * @param {number} [getGisData] - If true, check for feature server JSON data, default is true
     * @param {Array<string>} [context] Filter returned list by specific context, i.e. Office, Field, Mobile, Public, etc. Default is all.
     * @return {Object} Returns Promise object that represents an Object with the desired GIS service definitions
     */
    getConfig(whichType: any, whichId: any, getGisData?: boolean, context?: Array<string>): Promise<unknown>;
    /**
      * Get domain gis services
      *
      * @param {number} domainId - The mobile map cache Id to download
      * @return {Object} Returns Promise object that represents an Object with the domain's default GIS services
      */
    domain(domainId: any, getGisData?: boolean): Promise<unknown>;
    /**
       * Download mobile map cache
       *
       * @param {number} cacheId - The mobile map cache Id to download
       * @return {Object} Returns Promise object that represents a streaming download (?)
       */
    downloadMobile(cacheId: any, getGisData?: boolean): Promise<unknown>;
    /**
     * Get initial extent for user
     *
     * @return {Object} Returns Promise object that represents ... (?)
     */
    initialExtent(): Promise<unknown>;
    /**
     * Get service request gis services
     *
     * @param {number} requestId - The work order to check against.
     * @param {boolean} getGisData - If true, check for feature server JSON data, default is true.
     * @return {Object} Returns Promise object that represents an Object with the specified request's entit(y|ies)
     */
    request(requestId: any, getGisData?: boolean): Promise<unknown>;
    /**
       * Get inspection gis services
       *
       * @param {number} inspectionId - The work order to check against.
       * @param {boolean} getGisData - If true, check for feature server JSON data, default is true.
       * @return {Object} Returns Promise object that represents an Object with the specified inspection's entity
       */
    inspection(inspectionId: any, getGisData?: boolean): Promise<unknown>;
    /**
       * Get workorder gis services
       *
       * @param {number} workOrderSid - The work order to check against.
       * @param {boolean} getGisData - If true, check for feature server JSON data, default is true.
       * @return {Object} Returns Promise object that represents an Object with the specified work order's entit(y|ies)
       */
    workOrder(workOrderSid: any, getGisData?: boolean): Promise<unknown>;
    /**
       * Get service request gis services
       *
       * @param {Array<string>} [context] Filter returned list by specific context, i.e. Office, Field, Mobile, Public, etc. Default is all.
       * @param {boolean} [allDomains] services assigned to any domain the user belongs to, default is true
       * @param {boolean} [allGroups] services assigned to any groups the user belongs to regardless of domain, default is true
       * @param {boolean} [getGisData] If true, check for feature server JSON data, default is true
       * @return {Object} Returns Promise object that represents an Object with the user's GIS services
       */
    user(context?: Array<string>, allDomains?: boolean, allGroups?: boolean, getGisData?: boolean): Promise<unknown>;
    /**
       * Get currently selected entities from the Cityworks install's session for your user
       * @return {Object} Returns Promise object that represents an Object with the currently-selected entities
       */
    selectedEntities(): Promise<unknown>;
}
