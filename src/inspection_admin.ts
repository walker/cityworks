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
}
