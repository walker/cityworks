export interface RecentActivityUserOptions {
    IncludeCases?: boolean
    IncludeFireHydFlowTests?: boolean
    IncludeInspections?: boolean
    IncludeManholeInspections?: boolean
    IncludePavementInspections?: boolean
    IncludeRequests?: boolean
    IncludeTvInspections?: boolean
    IncludeWorkOrders?: boolean
    MaxResults?: number
}

export interface RecentActivityClearOptions {
    EmployeeSids?: Array<number>
    Cases?: boolean
    HydrantFlowTests?: boolean
    Inspections?: boolean
    ManholeInspections?: boolean
    PavementInspections?: boolean
    Requests?: boolean
    TvInspections?: boolean
    WorkOrders?: boolean
}

export class RecentActivity {
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
     * Record a user viewing a case.
     */
    caseViewed(caseId: number, dateTimeStamp?: Date | string) {
        return new Promise((resolve, reject) => {
            var data: { CaseId: number, DateTimeStamp?: Date | string } = {
                CaseId: caseId
            }
            if (typeof dateTimeStamp !== 'undefined') {
                data.DateTimeStamp = dateTimeStamp
            }
            this.cw.runRequest('Ams/RecentActivity/CaseViewed', data).then(r => {
                resolve(r.Value)
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Clear recent activity list for current user.
     */
    clear(options?: RecentActivityClearOptions) {
        return new Promise((resolve, reject) => {
            var data = options || {}
            this.cw.runRequest('Ams/RecentActivity/Clear', data).then(r => {
                resolve(r.Value)
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Record a user viewing a fire hydrant flow test.
     */
    fireHydFlowTestViewed(testId: number, dateTimeStamp?: Date | string) {
        return new Promise((resolve, reject) => {
            var data: { TestId: number, DateTimeStamp?: Date | string } = {
                TestId: testId
            }
            if (typeof dateTimeStamp !== 'undefined') {
                data.DateTimeStamp = dateTimeStamp
            }
            this.cw.runRequest('Ams/RecentActivity/FireHydFlowTestViewed', data).then(r => {
                resolve(r.Value)
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Record a user viewing an inspection.
     */
    inspectionViewed(inspectionId: number, dateTimeStamp?: Date | string) {
        return new Promise((resolve, reject) => {
            var data: { InspectionId: number, DateTimeStamp?: Date | string } = {
                InspectionId: inspectionId
            }
            if (typeof dateTimeStamp !== 'undefined') {
                data.DateTimeStamp = dateTimeStamp
            }
            this.cw.runRequest('Ams/RecentActivity/InspectionViewed', data).then(r => {
                resolve(r.Value)
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Record a user viewing a manhole inspection.
     */
    manholeInspectionViewed(inspectionId: number, dateTimeStamp?: Date | string) {
        return new Promise((resolve, reject) => {
            var data: { InspectionId: number, DateTimeStamp?: Date | string } = {
                InspectionId: inspectionId
            }
            if (typeof dateTimeStamp !== 'undefined') {
                data.DateTimeStamp = dateTimeStamp
            }
            this.cw.runRequest('Ams/RecentActivity/ManholeInspectionViewed', data).then(r => {
                resolve(r.Value)
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Record a user viewing a pavement inspection.
     */
    pavementInspectionViewed(inspectionSid: number, dateTimeStamp?: Date | string) {
        return new Promise((resolve, reject) => {
            var data: { InspectionSid: number, DateTimeStamp?: Date | string } = {
                InspectionSid: inspectionSid
            }
            if (typeof dateTimeStamp !== 'undefined') {
                data.DateTimeStamp = dateTimeStamp
            }
            this.cw.runRequest('Ams/RecentActivity/PavementInspectionViewed', data).then(r => {
                resolve(r.Value)
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Record a user viewing a request.
     */
    requestViewed(requestId: number, dateTimeStamp?: Date | string) {
        return new Promise((resolve, reject) => {
            var data: { RequestId: number, DateTimeStamp?: Date | string } = {
                RequestId: requestId
            }
            if (typeof dateTimeStamp !== 'undefined') {
                data.DateTimeStamp = dateTimeStamp
            }
            this.cw.runRequest('Ams/RecentActivity/RequestViewed', data).then(r => {
                resolve(r.Value)
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Record a user viewing a TV inspection.
     */
    tvInspectionViewed(tvId: number, dateTimeStamp?: Date | string) {
        return new Promise((resolve, reject) => {
            var data: { TvId: number, DateTimeStamp?: Date | string } = {
                TvId: tvId
            }
            if (typeof dateTimeStamp !== 'undefined') {
                data.DateTimeStamp = dateTimeStamp
            }
            this.cw.runRequest('Ams/RecentActivity/TvInspectionViewed', data).then(r => {
                resolve(r.Value)
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Get recent activities for current user.
     */
    user(options?: RecentActivityUserOptions) {
        return new Promise((resolve, reject) => {
            var data = options || {}
            this.cw.runRequest('Ams/RecentActivity/User', data).then(r => {
                resolve(r.Value)
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Record a user viewing a work order.
     */
    workOrderViewed(workOrderSid: number, workOrderId?: string, dateTimeStamp?: Date | string) {
        return new Promise((resolve, reject) => {
            var data: { WorkOrderSid: number, WorkOrderId?: string, DateTimeStamp?: Date | string } = {
                WorkOrderSid: workOrderSid
            }
            if (typeof workOrderId !== 'undefined') {
                data.WorkOrderId = workOrderId
            }
            if (typeof dateTimeStamp !== 'undefined') {
                data.DateTimeStamp = dateTimeStamp
            }
            this.cw.runRequest('Ams/RecentActivity/WorkOrderViewed', data).then(r => {
                resolve(r.Value)
            }).catch(e => {
                reject(e)
            })
        })
    }
}