export declare class WorkOrderAdmin {
    /**
     * @hidden
     */
    cw: any;
    /**
     * @hidden
     */
    constructor(cw: any);
    /**
     * Get entity groups
     *
     * @category WorkOrders Admin
     * @return {Object} Returns Promise that represents a collection of all entity groups
     */
    getEntityGroups(): Promise<unknown>;
    /**
     * Get entity types
     *
     * @category WorkOrders Admin
     * @return {Object} Returns Promise that represents a collection of all GIS WorkOrder entity types
     */
    getEntityTypes(entityGroups: Array<string>): Promise<unknown>;
    /**
     * Get WorkOrder templates
     *
     * @category WorkOrders Admin
     * @return {Object} Returns Promise that represents a collection of all WorkOrder templates
     */
    getTemplates(entityType: string, includeComments?: boolean, includeInstructions?: boolean): Promise<unknown>;
    /**
     * Update WorkOrder template
     *
     * @category WorkOrders Admin
     * @param {Object} wOTemplate - Obect that describes the WorkOrder Template
     * @return {Object} Returns Promise that represents a collection of all
     */
    updateTemplate(wOTemplate: Object): Promise<unknown>;
    /**
     * Get template group rights for provided WorkOrder Templates
     *
     * @category WorkOrders Admin
     * @param {Array<number>} wOTemplateIds - Array one or more WorkOrder Template IDs
     * @return {Object} Returns Promise that represents a collection of all
     */
    getTemplateGroupRights(wOTemplateIds: Array<number>): Promise<unknown>;
    /**
     * Get template activity services for provided WorkOrder Templates
     *
     * @category WorkOrders Admin
     * @param {Array<number>} wOTemplateIds - Array one or more WorkOrder Template IDs
     * @return {Object} Returns Promise that represents a collection of all
     */
    getTemplateActivity(wOTemplateIds: Array<number>): Promise<unknown>;
    /**
     * Get fields which will be updated when provided WorkOrder Template instance closes
     *
     * @category WorkOrders Admin
     * @param {Array<number>} wOTemplateIds - Array one or more WorkOrder Template IDs
     * @return {Object} Returns Promise that represents a collection of all
     */
    getUpdateFields(wOTemplateIds: Array<number>): Promise<unknown>;
    /**
     * Get equipment
     *
     * @category WorkOrders Admin
     * @param {Array<number>} wOTemplateIds - WorkOrder Template ID
     * @return {Object} Returns Promise that represents a collection of all
     */
    getTemplateEquipment(wOTemplateId: number): Promise<unknown>;
    /**
     * Get labor
     *
     * @category WorkOrders Admin
     * @param {Array<number>} wOTemplateIds - WorkOrder Template ID
     * @return {Object} Returns Promise that represents a collection of all
     */
    getTemplateLabor(wOTemplateId: number): Promise<unknown>;
    /**
     * Get material
     *
     * @category WorkOrders Admin
     * @param {number} wOTemplateId - WorkOrder Template ID
     * @return {Object} Returns Promise that represents a collection of all
     */
    getTemplateMaterial(wOTemplateId: number): Promise<unknown>;
    /**
     * Get map layer fields configured for provided WorkOrder template
     *
     * @category WorkOrders Admin
     * @param {number} wOTemplateId - WorkOrder Template ID
     * @return {Object} Returns Promise that represents a collection of all
     */
    getTemplateMapLayerFields(wOTemplateId: number): Promise<unknown>;
    /**
     * Get tasks configured for provided WorkOrder template
     *
     * @category WorkOrders Admin
     * @param {number} wOTemplateId - WorkOrder Template ID
     * @return {Object} Returns Promise that represents a collection of all tasks on WorkOrder template
     */
    getTemplateTasks(wOTemplateId: number): Promise<unknown>;
    /**
     * Get inspections connected to provided WorkOrder template
     *
     * @category WorkOrders Admin
     * @param {number} wOTemplateId - WorkOrder Template ID
     * @return {Object} Returns Promise that represents a collection of all tasks on WorkOrder template
     */
    getRelatedInspectionTemplates(wOTemplateId: number): Promise<unknown>;
}
