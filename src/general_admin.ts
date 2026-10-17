export interface CwHoliday {
    Holiday: Date | string
    Description?: string
}

export interface EurlQueryFindReplaceOptions {
    QueryDefinitionIds?: Array<number>
    DomainIds?: Array<number>
    IsPublic?: boolean
    QueryIds?: Array<number>
    CreatedBySids?: Array<number>
    Configuration?: string
}

export class GeneralAdmin {
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
     * Add a new holiday.
     */
    addHoliday(holiday: Date | string, description: string) {
        return new Promise((resolve, reject) => {
            var data = {
                Holiday: holiday,
                Description: description
            }
            this.cw.runRequest('General/Holidays/Add', data).then(r => {
                resolve(r.Value)
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Get all defined holidays with optional date filtering.
     */
    getHolidays(startDate?: Date | string, endDate?: Date | string) {
        return new Promise((resolve, reject) => {
            var data: { StartDate?: Date | string, EndDate?: Date | string } = {}
            if (typeof startDate !== 'undefined') {
                data.StartDate = startDate
            }
            if (typeof endDate !== 'undefined') {
                data.EndDate = endDate
            }
            this.cw.runRequest('General/Holidays/All', data).then(r => {
                resolve(r.Value)
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Get a holiday definition by date.
     */
    getHolidayByDate(date: Date | string) {
        return new Promise((resolve, reject) => {
            var data = {
                Date: date
            }
            this.cw.runRequest('General/Holidays/ByDate', data).then(r => {
                resolve(r.Value)
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Delete holidays by date.
     */
    deleteHolidays(holidays: Array<Date | string>) {
        return new Promise((resolve, reject) => {
            var data = {
                Holidays: holidays
            }
            this.cw.runRequest('General/Holidays/Delete', data).then(r => {
                resolve(r.Value)
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Update text in Eurl Query Definition Configuration.
     */
    findReplaceConfigurationText(oldText: string, newText: string, options?: EurlQueryFindReplaceOptions) {
        return new Promise((resolve, reject) => {
            var data_init = {
                OldText: oldText,
                NewText: newText
            }
            var data = Object.assign(data_init, options || {})
            this.cw.runRequest('General/EurlQuery/FindReplaceConfigurationText', data).then(r => {
                resolve(r.Value)
            }).catch(e => {
                reject(e)
            })
        })
    }
}