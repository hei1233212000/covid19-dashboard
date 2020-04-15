import { capitalize as lodashCapitalize, groupBy as lodashGroupBy, isEmpty as lodashIsEmpty } from 'lodash'
import moment from 'moment'

export default class Utils {
    static isEmpty(obj: any): boolean {
        return lodashIsEmpty(obj)
    }

    static isNotEmpty(obj: any): boolean {
        return !Utils.isEmpty(obj)
    }

    static capitalize(anyString: string): string {
        return lodashCapitalize(anyString)
    }

    static timestampToString(timestampInMillisecond: number, dateFormat: string): string {
        return moment(timestampInMillisecond).utc().format(dateFormat)
    }

    static timestampToStringWithOffset(timestampInMillisecond: number, offset: number, dateFormat: string): string {
        return moment(timestampInMillisecond).utcOffset(offset).format(dateFormat)
    }

    static localOffset = (): number => {
        return new Date().getTimezoneOffset() * -1
    }

    static groupBy<E, K>(listOfObjects: E[], groupByFunction: (e: E) => string): Map<string, E[]> {
        const grouped = lodashGroupBy<E>(listOfObjects, groupByFunction)
        const result = new Map<string, E[]>()
        for (let key of Object.keys(grouped)) {
            result.set(key, grouped[key])
        }
        return result
    }

    static formatNumberWithCommas = (anyNumber: number): string => {
        return anyNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
}