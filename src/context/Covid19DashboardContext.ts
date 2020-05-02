import { Country } from '../models/internal/country-internal-models'
import { Covid19Data } from '../models/internal/covid19-internal-models'
import Utils from '../utils/Utils'
import { createContext } from 'react'

export const Covid19DashboardContext = createContext({} as Covid19DashboardState)

export interface RefreshCovid19DataFunction {
    (manualRefresh?: boolean): void
}

export class Covid19DashboardState {
    readonly countries: Country[]
    readonly covid19Data: Covid19Data[]
    readonly latestCovid19Data: Covid19Data[]
    readonly earliestRecordTimestamp: number
    readonly latestRecordTimestamp: number
    readonly totalCumulativeConfirms: number
    readonly totalCumulativeDeaths: number
    readonly numberOfCountriesWithCases: number
    readonly ready: boolean
    readonly refreshCovid19DataFunction: RefreshCovid19DataFunction

    constructor(
        countries: Country[],
        covid19Data: Covid19Data[],
        refreshCovid19DataFunction: RefreshCovid19DataFunction
    ) {
        this.countries = countries
        this.covid19Data = covid19Data
        this.refreshCovid19DataFunction = refreshCovid19DataFunction

        this.earliestRecordTimestamp = this.findTimestamp(this.covid19Data, Math.min)
        this.latestRecordTimestamp = this.findTimestamp(this.covid19Data, Math.max)
        this.latestCovid19Data = this.extractLatestCovid19Data(this.covid19Data)
        this.totalCumulativeConfirms = this.findTotalCumulativeConfirms(this.latestCovid19Data)
        this.totalCumulativeDeaths = this.findTotalCumulativeDeaths(this.latestCovid19Data)
        this.numberOfCountriesWithCases = this.findNumberOfCountriesWithCases(this.latestCovid19Data)

        this.ready = Utils.isNotEmpty(countries) && Utils.isNotEmpty(covid19Data)
    }

    extractLatestCovid19Data = (covid19Data: Covid19Data[]): Covid19Data[] => {
        const grouped = Utils.groupBy(covid19Data, (data: Covid19Data) => data.countryCode)
        const result: Covid19Data[] = []
        grouped.forEach((history: Covid19Data[]) => {
            if (Utils.isNotEmpty(history)) {
                const latestRecord = history[history.length - 1]
                result.push(latestRecord)
            }
        })
        return result
    }

    findTotalCumulativeConfirms = (covid19Data: Covid19Data[]): number => {
        return covid19Data.reduce((accumulatedNumberOfCumulativeConfirms: number, data: Covid19Data) => {
            return accumulatedNumberOfCumulativeConfirms + data.numberOfCumulativeConfirms
        }, 0)
    }

    findNumberOfCountriesWithCases = (covid19Data: Covid19Data[]): number => {
        return covid19Data.length
    }

    findTotalCumulativeDeaths = (covid19Data: Covid19Data[]): number => {
        return covid19Data.reduce((accumulatedNumberOfCumulativeDeaths: number, data: Covid19Data) => {
            return accumulatedNumberOfCumulativeDeaths + data.numberOfCumulativeDeaths
        }, 0)
    }

    findTimestamp = (covid19Data: Covid19Data[], extract: (...values: number[]) => number): number => {
        const timestampInMilliseconds = covid19Data.map((data: Covid19Data) => {
            return data.timestampInMillisecond
        })
        return extract(...timestampInMilliseconds)
    }
}
