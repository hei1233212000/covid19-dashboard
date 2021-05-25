import { groupBy as lodashGroupBy, isEmpty as lodashIsEmpty, round as loadashRound } from 'lodash'
import moment from 'moment'

export default class Utils {
    static isEmpty(obj: any): boolean {
        return lodashIsEmpty(obj)
    }

    static isNotEmpty(obj: any): boolean {
        return !Utils.isEmpty(obj)
    }

    static timestampToStringWithOffset(timestampInMillisecond: number, offset: number, dateFormat: string): string {
        return moment(timestampInMillisecond).utcOffset(offset).format(dateFormat)
    }

    static localOffset = (): number => {
        return new Date().getTimezoneOffset() * -1
    }

    static groupBy<E>(listOfObjects: E[], groupByFunction: (e: E) => string): Map<string, E[]> {
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

    static isNumber = (stringInput: string): boolean => {
        return /^-?[0-9]\d*(\.\d+)?$/.test(stringInput)
    }

    static minuteToMilliseconds = (minutes: number): number => {
        return minutes * 60 * 1000
    }

    static currentUtcTimestampInMilliseconds = (): number => {
        return moment.utc().valueOf()
    }

    static formatPercentage = (anyNumber: number): string => {
        const roundingPrecision = 2
        // it is a trick to deal with the floating point calculation
        const roundedPercentage = loadashRound(anyNumber * 100.0, roundingPrecision + 1)
        return roundedPercentage.toFixed(roundingPrecision) + '%'
    }
}