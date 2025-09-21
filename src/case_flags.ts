import { CWError } from './error'

const _ = require('lodash')

export class CaseFlags {
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
   * Add flag to case
   *
   * @category Case Flags
   * @param {number} caObjectId - The Case Object to add the flag to.
   * @param {number} flagId - The flag ID
   * @param {string} severity - The severity of the flag
   * @param {number} appliedBy - Which userID is applying the flag
   * @param {DateTime} DateApplied - The date that the flag should be applied
   * @param {Object} [options] - Options for CaseFlags includes Notes, DisciplineId, CompletedBy, DateCompleted
   * @return {Object} Returns Promise that represents an object describing CaFlag.
   */
   add(caObjectId: number, flagId: number, severity: string, appliedBy: number, DateApplied: Date, options?: {Notes?: string, DisciplineId?: number, CompletedBy?: number, DateCompleted?: Date}) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId,
        FlagId: flagId,
        Severity: severity,
        AppliedBy: appliedBy,
        DateApplied: DateApplied
      }
      if(typeof(options)!='undefined') {
        data = _.merge(data, options)
      }
      this.cw.runRequest('Pll/CaseFlags/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete specific flag from case
   *
   * @category Case Flags
   * @param {number} caFlagId - The CaFlagId (case flag instance ID) that should be deleted
   * @return {Object} Returns Promise that represents the CaFlag that has been deleted.
   */
  delete(caFlagId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaFlagId: caFlagId
      }
      this.cw.runRequest('Pll/CaseFlags/Delete', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete all flags from case
   *
   * @category Case Flags
   * @param {number} caObjectId - The Case Object to delete the flags from.
   * @return {Object} Returns Promise that represents the number of flags deleted from the case provided.
   */
  deleteAll(caObjectId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId
      }
      this.cw.runRequest('Pll/CaseFlags/DeleteByCaObjectId', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get flags attached to a specific case
   *
   * @category Case Flags
   * @param {number} caObjectId - The Case Object from which to get attached flags
   * @return {Object} Returns Promise that represents a collection of the default CaFlags.
   */
  getForCase(caObjectId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId
      }
      this.cw.runRequest('Pll/CaseFlags/ByCaObjectId', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }


  /**
   * Search for Case Flags. Include one or more of the search fields. A logical 'and' operation is applied to muliple search fields
   *
   * @category Case Flags
   * @param {Object} filters - The parameters to search by. (CaFlagId, Flag, FlagDesc)
   * @return {Object} Returns Promise that represents an Array of resulting Flags
   */
   search(filters?: Object) {
    return new Promise((resolve, reject) => {
      if(_.intersectionBy(_.keysIn(filters), ['CaFlagId', 'Flag', 'FlagDesc']).length==0) {
        reject(new CWError(3, 'At least one of the attributes (CaFlagId, Flag, FlagDesc) must be defined.'))
      }
      var data = filters
      this.cw.runRequest('Pll/CaseFlags/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
