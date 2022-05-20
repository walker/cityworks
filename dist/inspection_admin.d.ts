export declare class InspectionAdmin {
    /**
     * @hidden
     */
    cw: any;
    /**
     * @hidden
     */
    constructor(cw: any);
    /**
     * Get inspection templates
     *
     * @category Inspection Templates
     * @param {Array<string>} [entityTypes] - The Entity Type(s) to return potential inspections for
     * @param {boolean} [canCreate] - If true, only return templates the user can create, ignored if false or null, default is true
     * @param {Object} [options] - An object which can include: [IncludeInactive]: boolean, MaximumDateModified: Date, MinimumDateModified: Date, TemplateIds: Array<number>
     * @return {Object} Returns Promise that represents a collection of all Inspections matching the provided parameters
     */
    getTemplates(entityTypes?: Array<string>, canCreate?: boolean, options?: {
        IncludeInactive?: boolean;
        MaximumDateModified?: Date;
        MinimumDateModified?: Date;
        TemplateIds?: Array<number>;
    }): Promise<unknown>;
}
