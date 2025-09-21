import { CWError } from './error'
const _ = require('lodash')

export class InspectionAdmin {
  /**
   * @hidden
   */
  cw: any

  /**
   * @hidden
   */
  constructor(cw) {
    this.cw = cw
  }

  /**
   * Get inspection templates
   *
   * @category Inspection Templates
   * @param {Array<string>} [entityTypes] - The Entity Type(s) to return potential inspections for
   * @param {boolean} [canCreate] - If true, only return templates the user can create, ignored if false or null, default is true
   * @param {Object} [options] - An object which can include: [IncludeInactive]: boolean, MaximumDateModified: Date, MinimumDateModified: Date, TemplateIds: Array<number>
   * @return {Object} Returns Promise that represents a collection of all Inspections matching the provided parameters
   */
  getTemplates(entityTypes?: Array<string>, canCreate?: boolean, options?: {IncludeInactive?: boolean, MaximumDateModified?: Date, MinimumDateModified?: Date, TemplateIds?: Array<number>}) {
    return new Promise((resolve, reject) => {
      var data: {EntityTypes?: Array<string>, CanCreate?: boolean, IncludeInactive?: boolean, MaximumDateModified?: Date, MinimumDateModified?: Date, TemplateIds?: Array<number>} = {}
      if(typeof(entityTypes)!=='undefined') {
        data.EntityTypes = entityTypes
      }
      data.CanCreate = typeof(canCreate)!=='undefined' ? canCreate : true
      if(typeof(options)==='object') {
        _.forIn(options, (v, k) => {
          data[k] = v
        })
      }
      this.cw.runRequest('Ams/InspectionTemplate/Templates', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get inspection template by ID
   *
   * @category Inspection Templates
   * @param {number} [templateId] - The ID of the template to retrieve
   * @return {Object} Returns Promise that represents the Inspection template matching the provided ID
   */
  getTemplateById(templateId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getTemplatesByIds([templateId]).then((r: Array<any>) => {
        resolve(r[0])
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get inspection templates by IDs
   *
   * @category Inspection Templates
   * @param {Array<number>} [templateIds] - The Entity Type(s) to return potential inspections for
   * @return {Object} Returns Promise that represents a collection of all Inspection templates matching the provided IDs
   */
  getTemplatesByIds(templateIds: Array<number>): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      var data: {InspTemplateIds?: Array<number>} = {}
      if (_.isArray(templateIds) && templateIds.length > 0) {
        data.InspTemplateIds = templateIds
      }
      this.cw.runRequest('Ams/InspectionTemplate/byIds', data).then((r: any) => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
