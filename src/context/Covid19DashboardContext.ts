import { Country } from '../models/internal/country-internal-models'
import { Covid19Data, Covid19FullData } from '../models/internal/covid19-internal-models'
import Utils from '../utils/Utils'
import { createContext } from 'react'

export const Covid19DashboardContext = createContext({} as Covid19DashboardState)

export interface RefreshCovid19FullDataFunction {
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
    readonly refreshCovid19FullDataFunction: RefreshCovid19FullDataFunction
    readonly lastUpdatedTimestamp: number
    readonly deathRate: number

    constructor(
        countries: Country[],
        covid19FullData: Covid19FullData,
        refreshCovid19FullDataFunction: RefreshCovid19FullDataFunction,
        lastUpdatedTimestamp: number
    ) {
        this.countries = countries
        this.covid19Data = covid19FullData.covid19Data
        this.refreshCovid19FullDataFunction = refreshCovid19FullDataFunction
        this.lastUpdatedTimestamp = lastUpdatedTimestamp

        const earliestAndLatestRecordTimestamp = this.findEarliestAndLatestRecordTimestamp(this.covid19Data)
        this.earliestRecordTimestamp = earliestAndLatestRecordTimestamp.earliestRecordTimestamp
        this.latestRecordTimestamp = earliestAndLatestRecordTimestamp.latestRecordTimestamp
        this.latestCovid19Data = this.extractLatestCovid19Data(this.covid19Data)
        this.totalCumulativeConfirms = this.findTotalCumulativeConfirms(this.latestCovid19Data)
        this.totalCumulativeDeaths = this.findTotalCumulativeDeaths(this.latestCovid19Data)
        this.numberOfCountriesWithCases = this.findNumberOfCountriesWithCases(this.latestCovid19Data)
        this.deathRate = 0
        if (this.totalCumulativeConfirms) {
            this.deathRate = this.totalCumulativeDeaths / this.totalCumulativeConfirms
        }

        // the countries should have one default item in it
        this.ready = Utils.isNotEmpty(this.countries)
            && countries.length > 1
            && Utils.isNotEmpty(this.covid19Data)
    }

    private extractLatestCovid19Data = (covid19Data: Covid19Data[]): Covid19Data[] => {
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

    private findTotalCumulativeConfirms = (covid19Data: Covid19Data[]): number => {
        return covid19Data.reduce((accumulatedNumberOfCumulativeConfirms: number, data: Covid19Data) => {
            return accumulatedNumberOfCumulativeConfirms + data.numberOfCumulativeConfirms
        }, 0)
    }

    private findNumberOfCountriesWithCases = (covid19Data: Covid19Data[]): number => {
        return covid19Data.length
    }

    private findTotalCumulativeDeaths = (covid19Data: Covid19Data[]): number => {
        return covid19Data.reduce((accumulatedNumberOfCumulativeDeaths: number, data: Covid19Data) => {
            return accumulatedNumberOfCumulativeDeaths + data.numberOfCumulativeDeaths
        }, 0)
    }

    private findEarliestAndLatestRecordTimestamp = (covid19Data: Covid19Data[]) => {
        const timestampInMilliseconds = covid19Data
            ? covid19Data.map((data: Covid19Data) => {
                return data.timestampInMillisecond
            })
            : []
        let len = timestampInMilliseconds.length;
        let max = -Infinity;
        let min = Infinity;

        while (len--) {
            const timestampInMillisecond = timestampInMilliseconds[len];
            max = timestampInMillisecond > max ? timestampInMillisecond : max;
            min = timestampInMillisecond < min ? timestampInMillisecond : min;
        }

        return {
            earliestRecordTimestamp: min,
            latestRecordTimestamp: max
        }
    }
}
