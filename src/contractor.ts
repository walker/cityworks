import _ from 'lodash';

export interface ContractorBase {
  ContractorSid?: number;
  ContractorName?: string;
  ContractorNumber?: string;
  RateType?: string;
  EmergencyFactor?: number;
  OverheadRate?: number;
  Rate?: number;
  Description?: string;
  OverheadType?: string;
  ProviderType?: string;
  OvertimeFactor?: number;
  ContactName?: string;
  Address?: string;
  City?: string;
  State?: string;
  Zip?: string;
  CellPhone?: string;
  OfficePhone?: string;
  Email?: string;
  LocallyBased?: boolean;
  Comments?: string;
  Licensed?: boolean;
  LicenseExpDate?: Date;
  LicensedWork?: string;
  Viewable?: boolean;
  FederalTaxId?: string;
  FMSNo?: string;
  PIN?: string;
  OtherPhone?: string;
  Fax?: string;
  MWBE?: boolean;
  RegistrationDate?: Date;
  LiabilityInsCertificate?: string;
  LiabilityInsEffectDate?: Date;
  LiabilityInsExpireDate?: Date;
  LiabilityInsAmount?: number;
  WorkersCompCertificate?: string;
  WorkersCompEffectDate?: Date;
  WorkersCompExpireDate?: Date;
  WorkersCompAmount?: number;
  AutomobileInsCertificate?: string;
  AutomobileInsEffectDate?: Date;
  AutomobileInsExpireDate?: Date;
  AutomobileInsAmount?: number;
  GeneralLiabilityCertificate?: string;
  GeneralLiabilityEffectDate?: Date;
  GeneralLiabilityExpireDate?: Date;
  GeneralLiabilityAmount?: number;
  ProvidesLabor?: boolean;
  ProvidesMaterial?: boolean;
  ProvidesEquipment?: boolean;
  CustomFieldValues?: Record<number, string>;
}

export class Contractor {
  cw: any

  constructor(cw) {
    this.cw = cw
  }

  add(contractor: ContractorBase) {
    return new Promise((resolve, reject) => {
      var data = contractor
      this.cw.runRequest('Ams/Contractor/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  update(contractorSid: number, contractorProperties: ContractorBase) {
    return new Promise((resolve, reject) => {
      var startingData = {
        ContractorSid: contractorSid
      }
      if(typeof contractorProperties.ContractorSid !== 'undefined') {
        delete contractorProperties.ContractorSid
      }
      var data = _.merge(startingData, contractorProperties)
      this.cw.runRequest('Ams/Contractor/Update', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  all(viewableOnly: boolean = false) {
    return new Promise((resolve, reject) => {
      var data = {
        ViewableOnly: viewableOnly
      }
      this.cw.runRequest('Ams/Contractor/All', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  getById(contractorSid: number) {
    return new Promise((resolve, reject) => {
      var data = {
        ContractorSid: contractorSid
      }
      this.cw.runRequest('Ams/Contractor/ById', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  search(contractorSids: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        ContractorSids: contractorSids
      }
      this.cw.runRequest('Ams/Contractor/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  customDataFields(contractorSid: number, custFieldIds?: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        ContractorSid: contractorSid
      }
      if(typeof custFieldIds !== 'undefined') {
        _.set(data, 'CustFieldIds', custFieldIds)
      }
      this.cw.runRequest('Ams/Contractor/CustomDataFields', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  delete(contractorSids: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        ContractorSids: contractorSids
      }
      this.cw.runRequest('Ams/Contractor/Delete', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  keywords(contractorSids: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        ContractorSids: contractorSids
      }
      this.cw.runRequest('Ams/Contractor/Keywords', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  addKeywords(contractorSids: Array<number>, keywords: Array<string>) {
    return new Promise((resolve, reject) => {
      var data = {
        ContractorSids: contractorSids,
        Keywords: keywords
      }
      this.cw.runRequest('Ams/Contractor/AddKeywords', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  deleteKeywords(contractorSids: Array<number>, keywords: Array<string>, all: boolean = false) {
    return new Promise((resolve, reject) => {
      var data = {
        ContractorSids: contractorSids,
        Keywords: keywords,
        All: all
      }
      this.cw.runRequest('Ams/Contractor/DeleteKeywords', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
