import _ from 'lodash';

export interface EquipmentReadData {
  Id?: number;
  Text1?: string;
  Text2?: string;
  Text3?: string;
  Text4?: string;
  Text5?: string;
  Text6?: string;
  Text7?: string;
  Text8?: string;
  Text9?: string;
  Text10?: string;
  Text11?: string;
  Text12?: string;
  Text13?: string;
  Text14?: string;
  Text15?: string;
  Text16?: string;
  Text17?: string;
  Text18?: string;
  Text19?: string;
  Text20?: string;
  Num1?: number;
  Num2?: number;
  Num3?: number;
  Num4?: number;
  Num5?: number;
  Num6?: number;
  Num7?: number;
  Num8?: number;
  Num9?: number;
  Num10?: number;
  Num11?: number;
  Num12?: number;
  Num13?: number;
  Num14?: number;
  Num15?: number;
  Num16?: number;
  Num17?: number;
  Num18?: number;
  Num19?: number;
  Num20?: number;
  Date1?: Date;
  Date2?: Date;
  Date3?: Date;
  Date4?: Date;
  Date5?: Date;
}

export interface EquipmentChangeoutOperation {
  ChangeOutId: number;
  Operation: number;
  AssetType?: string;
  NewUid?: string;
  OldUid?: string;
  RecordDate?: Date;
  OperationComments?: string;
  NewRead?: EquipmentReadData;
  OldRead?: EquipmentReadData;
}

export class EquipmentChangeout {
  cw: any

  constructor(cw) {
    this.cw = cw
  }

  addChangeOutRead(changeOutId: number, operationId: number, isNewRead: boolean, readData?: EquipmentReadData) {
    return new Promise((resolve, reject) => {
      var data = {
        ChangeOutId: changeOutId,
        OperationId: operationId,
        IsNewRead: isNewRead
      }
      if(readData) {
        data = _.merge(data, readData)
      }
      this.cw.runRequest('Ams/EquipmentChangeOut/AddChangeOutRead', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  addOperation(operation: EquipmentChangeoutOperation) {
    return new Promise((resolve, reject) => {
      var data = {
        ChangeOutId: operation.ChangeOutId,
        Operation: operation.Operation,
        AssetType: operation.AssetType,
        NewUid: operation.NewUid,
        OldUid: operation.OldUid,
        RecordDate: operation.RecordDate,
        OperationComments: operation.OperationComments
      }
      if(operation.NewRead) {
        Object.keys(operation.NewRead).forEach(key => {
          data[`NewRead_${key}`] = operation.NewRead![key]
        })
      }
      if(operation.OldRead) {
        Object.keys(operation.OldRead).forEach(key => {
          data[`OldRead_${key}`] = operation.OldRead![key]
        })
      }
      this.cw.runRequest('Ams/EquipmentChangeOut/AddOperation', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  attach(attachParams: {
    ChangeOutId: number,
    AssetType?: string,
    NewUid: string,
    NewRead?: EquipmentReadData,
    OperationId?: number,
    RecordDate?: Date,
    OperationComments?: string,
    FeatureType?: string,
    FeatureUid?: string,
    FeatureSid?: number,
    Location?: string,
    WorkOrderSid?: number,
    WorkOrderId?: string,
    InspectedBySid?: number,
    ChangeDate?: Date,
    ChangedById?: number,
    UpdateMap?: boolean,
    InspCustFieldCatId?: number
  }) {
    return new Promise((resolve, reject) => {
      var data = {
        ChangeOutId: attachParams.ChangeOutId,
        NewUid: attachParams.NewUid,
        AssetType: attachParams.AssetType,
        OperationId: attachParams.OperationId,
        RecordDate: attachParams.RecordDate,
        OperationComments: attachParams.OperationComments,
        FeatureType: attachParams.FeatureType,
        FeatureUid: attachParams.FeatureUid,
        FeatureSid: attachParams.FeatureSid,
        Location: attachParams.Location,
        WorkOrderSid: attachParams.WorkOrderSid,
        WorkOrderId: attachParams.WorkOrderId,
        InspectedBySid: attachParams.InspectedBySid,
        ChangeDate: attachParams.ChangeDate,
        ChangedById: attachParams.ChangedById,
        UpdateMap: attachParams.UpdateMap,
        InspCustFieldCatId: attachParams.InspCustFieldCatId
      }
      if(attachParams.NewRead) {
        Object.keys(attachParams.NewRead).forEach(key => {
          data[`NewRead_${key}`] = attachParams.NewRead![key]
        })
      }
      this.cw.runRequest('Ams/EquipmentChangeOut/Attach', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  detach(detachParams: {
    ChangeOutId: number,
    AssetType?: string,
    OldUid: string,
    OldRead?: EquipmentReadData,
    OperationId?: number,
    RecordDate?: Date,
    OperationComments?: string,
    FeatureType?: string,
    FeatureUid?: string,
    FeatureSid?: number,
    Location?: string,
    WorkOrderSid?: number,
    WorkOrderId?: string,
    InspectedBySid?: number,
    ChangeDate?: Date,
    ChangedById?: number,
    UpdateMap?: boolean,
    InspCustFieldCatId?: number
  }) {
    return new Promise((resolve, reject) => {
      var data = {
        ChangeOutId: detachParams.ChangeOutId,
        OldUid: detachParams.OldUid,
        AssetType: detachParams.AssetType,
        OperationId: detachParams.OperationId,
        RecordDate: detachParams.RecordDate,
        OperationComments: detachParams.OperationComments,
        FeatureType: detachParams.FeatureType,
        FeatureUid: detachParams.FeatureUid,
        FeatureSid: detachParams.FeatureSid,
        Location: detachParams.Location,
        WorkOrderSid: detachParams.WorkOrderSid,
        WorkOrderId: detachParams.WorkOrderId,
        InspectedBySid: detachParams.InspectedBySid,
        ChangeDate: detachParams.ChangeDate,
        ChangedById: detachParams.ChangedById,
        UpdateMap: detachParams.UpdateMap,
        InspCustFieldCatId: detachParams.InspCustFieldCatId
      }
      if(detachParams.OldRead) {
        Object.keys(detachParams.OldRead).forEach(key => {
          data[`OldRead_${key}`] = detachParams.OldRead![key]
        })
      }
      this.cw.runRequest('Ams/EquipmentChangeOut/Detach', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  replace(replaceParams: {
    ChangeOutId: number,
    AssetType?: string,
    OldUid: string,
    NewUid: string,
    OldRead?: EquipmentReadData,
    NewRead?: EquipmentReadData,
    OperationId?: number,
    RecordDate?: Date,
    OperationComments?: string,
    FeatureType?: string,
    FeatureUid?: string,
    FeatureSid?: number,
    Location?: string,
    WorkOrderSid?: number,
    WorkOrderId?: string,
    InspectedBySid?: number,
    ChangeDate?: Date,
    ChangedById?: number,
    UpdateMap?: boolean,
    InspCustFieldCatId?: number
  }) {
    return new Promise((resolve, reject) => {
      var data = {
        ChangeOutId: replaceParams.ChangeOutId,
        OldUid: replaceParams.OldUid,
        NewUid: replaceParams.NewUid,
        AssetType: replaceParams.AssetType,
        OperationId: replaceParams.OperationId,
        RecordDate: replaceParams.RecordDate,
        OperationComments: replaceParams.OperationComments,
        FeatureType: replaceParams.FeatureType,
        FeatureUid: replaceParams.FeatureUid,
        FeatureSid: replaceParams.FeatureSid,
        Location: replaceParams.Location,
        WorkOrderSid: replaceParams.WorkOrderSid,
        WorkOrderId: replaceParams.WorkOrderId,
        InspectedBySid: replaceParams.InspectedBySid,
        ChangeDate: replaceParams.ChangeDate,
        ChangedById: replaceParams.ChangedById,
        UpdateMap: replaceParams.UpdateMap,
        InspCustFieldCatId: replaceParams.InspCustFieldCatId
      }
      if(replaceParams.OldRead) {
        Object.keys(replaceParams.OldRead).forEach(key => {
          data[`OldRead_${key}`] = replaceParams.OldRead![key]
        })
      }
      if(replaceParams.NewRead) {
        Object.keys(replaceParams.NewRead).forEach(key => {
          data[`NewRead_${key}`] = replaceParams.NewRead![key]
        })
      }
      this.cw.runRequest('Ams/EquipmentChangeOut/Replace', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
