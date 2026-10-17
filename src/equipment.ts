import _ from 'lodash';
import { EquipmentChangeout } from './equipment_changeout'
import { EquipmentCost } from './equipment_cost'
import { EquipmentReservation } from './equipment_reservation'

export interface EquipmentBase {
  EquipmentUid?: string;
  EquipmentSid?: number;
  Category?: string;
  DefaultImgPath?: string;
  Description?: string;
  Manufacturer?: string;
  Model?: string;
  ForCheckout?: boolean;
  RateType?: string;
  UnitCost?: number;
  WarranteeDate?: Date;
  Viewable?: boolean;
  CustomFieldValues?: Record<number, string>;
}

export { EquipmentChangeout } from './equipment_changeout'
export { EquipmentCost } from './equipment_cost'
export { EquipmentReservation } from './equipment_reservation'
export type { EquipmentReadData, EquipmentChangeoutOperation } from './equipment_changeout'
export type { EquipmentCostOptions } from './equipment_cost'
export type { EquipmentReservationOptions } from './equipment_reservation'

/**
 * A plugin that contains equipment methods for a Cityworks install
 */
export class Equipment {
  /**
   * @hidden
   */
  cw: any

  /**
   * Changeout operations for equipment
   */
  changeout: EquipmentChangeout

  /**
   * Cost operations for equipment
   */
  cost: EquipmentCost

  /**
   * Reservation operations for equipment
   */
  reservation: EquipmentReservation

  /**
   * @hidden
   */
  constructor(cw) {
    this.cw = cw
    this.changeout = new EquipmentChangeout(cw)
    this.cost = new EquipmentCost(cw)
    this.reservation = new EquipmentReservation(cw)
  }

  /**
   * Add new equipment
   *
   * @param {EquipmentBase} equipment - The equipment information. `EquipmentUid` is a required field.
   * @return {Object} Returns Promise object that represents an object that is the newly-added equipment
   */
  add(equipment: EquipmentBase) {
    return new Promise((resolve, reject) => {
      var data = equipment
      this.cw.runRequest('Ams/Equipment/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Update existing equipment
   *
   * @param {number | Array<number>} equipmentSids - The SIDs of the equipment to update.
   * @param {EquipmentBase} equipmentProperties - The equipment information to update. `EquipmentSid` cannot be included in the equipmentProperties object, as those are used to identify which equipment to update and could cause unintended consequences if included in the update information.
   * @return {Object} Returns Promise object that represents an object that is the updated equipment
   */
  update(equipmentSids: number | Array<number>, equipmentProperties: EquipmentBase) {
    return new Promise((resolve, reject) => {
      if(typeof equipmentSids === 'number') {
        equipmentSids = [equipmentSids]
      }
      var startingData = {
        EquipmentSids: equipmentSids
      }
      if(typeof equipmentProperties.EquipmentSid !== 'undefined')
        delete equipmentProperties.EquipmentSid
      var data = _.merge(startingData, equipmentProperties)
      this.cw.runRequest('Ams/Equipment/Update', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get equipment custom data fields by id
   */
  customDataFields(equipmentSid: number, custFieldIds?: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        EquipmentSid: equipmentSid
      }
      if(typeof custFieldIds !== 'undefined')
        _.set(data, 'CustFieldIds', custFieldIds)
      this.cw.runRequest('Ams/Equipment/CustomDataFields', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get all equipment
   */
  all(viewableOnly: boolean = true) {
    return new Promise((resolve, reject) => {
      var data = {
        ViewableOnly: viewableOnly
      }
      this.cw.runRequest('Ams/Equipment/All', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get equipment by ID
   */
  getById(equipmentSid: number) {
    return new Promise((resolve, reject) => {
      this.getByIds([equipmentSid]).then((r) => {
        const row = r as EquipmentBase[];
        resolve(row[0])
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get equipment by IDs
   */
  getByIds(equipmentSids: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        EquipmentSids: equipmentSids
      }
      this.cw.runRequest('Ams/Equipment/ByIds', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete equipment by ID
   */
  delete(equipmentSids: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        EquipmentSids: equipmentSids
      }
      this.cw.runRequest('Ams/Equipment/Delete', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Search for equipment
   */
  search(searchParameters: { Description?: Array<string>, EquipmentSid?: Array<number>, EquipmentUid?: Array<string>, ForCheckout?: boolean, Manufacturer?: Array<string>, Model?: Array<string>, RateType?: Array<string>, Viewable?: boolean }, maxResults: number = 20) {
    var startingData = {
      MaxResults: maxResults
    }
    var data = _.merge(startingData, searchParameters)
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/Equipment/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
