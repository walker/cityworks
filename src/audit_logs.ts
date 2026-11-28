import { CWError } from './error'
import type { CityworksClient } from './client'

export interface CWMetaData {
    CWId?: string
    CwSid?: number
    DateModified?: Date | string
    FieldName?: string
    LoginName?: string
    NewValue?: string
    ObjectId?: number
    OldValue?: string
    TableName?: string
}

export class AuditLogs {
    /**
     * @hidden
     */
    cw: CityworksClient

    /**
     * Storage of the active table name context.
     */
    currentTableName: string

    /**
     * @hidden
     */
    constructor(cw: CityworksClient, tableName: string) {
        this.cw = cw
        this.currentTableName = tableName.toUpperCase()
        if (['INSPECTION', 'REQUEST', 'WORKORDER'].indexOf(this.currentTableName) === -1) {
            throw CWError.validation(1, 'Audit log table name not found.', {
                provided: tableName,
                options: ['INSPECTION', 'REQUEST', 'WORKORDER']
            })
        }
    }

    /**
     * Get audit log metadata by current table name context and SIDs.
     */
    get(ids: number | Array<number>) {
        return new Promise((resolve, reject) => {
            var sidList = Array.isArray(ids) ? ids : [ids]
            var data = {
                Ids: sidList,
                TableName: this.currentTableName
            }
            this.cw.runRequest('General/CwMetaData/ByTableNameSids', data).then((r: any) => {
                resolve(r.Value)
            }).catch((e: any) => {
                reject(e)
            })
        })
    }
}