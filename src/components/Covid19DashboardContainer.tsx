import React, { useEffect, useState } from 'react'
import { Country } from '../models/internal/country-internal-models'
import Utils from '../utils/utils'
import CountryApi from '../api/CountryApi'
import { Covid19Data } from '../models/internal/covid19-internal-models'
import { Covid19Api } from '../api/Covid19Api'
import Covid19Dashboard from './Covid19Dashboard'
import Covid19LoadingSpinner from './Covid19LoadingSpinner';

const Covid19DashboardContainer = (): JSX.Element => {
    const countries = useCountries()
    const covid19Data = useCovid19Data()
    const earliestRecordTimestamp = findTimestamp(covid19Data, Math.min)
    const latestRecordTimestamp = findTimestamp(covid19Data, Math.max)
    const latestCovid19Data = extractLatestCovid19Data(covid19Data)
    const totalCumulativeConfirms = findTotalCumulativeConfirms(latestCovid19Data)
    const totalCumulativeDeaths = findTotalCumulativeDeaths(latestCovid19Data)
    const numberOfCountriesWithCases = findNumberOfCountriesWithCases(latestCovid19Data)
    if (Utils.isNotEmpty(countries) && Utils.isNotEmpty(covid19Data)) {
        return <Covid19Dashboard
            countries={countries}
            covid19Data={covid19Data}
            latestCovid19Data={latestCovid19Data}
            earliestRecordTimestamp={earliestRecordTimestamp}
            latestRecordTimestamp={latestRecordTimestamp}
            totalCumulativeConfirms={totalCumulativeConfirms}
            totalCumulativeDeaths={totalCumulativeDeaths}
            numberOfCountriesWithCases={numberOfCountriesWithCases}
        />
    } else {
        return <Covid19LoadingSpinner/>
    }
}

const useCountries = (): Country[] => {
    const initialState: Country[] = []
    const [countries, setCountries] = useState(initialState)
    useEffect(() => {
        CountryApi.findCountries()
            .then(data => setCountries(data))
    }, [])
    return countries
}

const useCovid19Data = (): Covid19Data[] => {
    const initialState: Covid19Data[] = []
    const [covid19Data, setCovid19Data] = useState(initialState)
    useEffect(() => {
        Covid19Api.findCovid19Data()
            .then(data => setCovid19Data(data))
    }, [])
    return covid19Data
}

const extractLatestCovid19Data = (covid19Data: Covid19Data[]): Covid19Data[] => {
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

const findTotalCumulativeConfirms = (covid19Data: Covid19Data[]): number => {
    return covid19Data.reduce((accumulatedNumberOfCumulativeConfirms: number, data: Covid19Data) => {
        return accumulatedNumberOfCumulativeConfirms + data.numberOfCumulativeConfirms
    }, 0)
}

const findNumberOfCountriesWithCases = (covid19Data: Covid19Data[]): number => {
    return covid19Data.length
}

const findTotalCumulativeDeaths = (covid19Data: Covid19Data[]): number => {
    return covid19Data.reduce((accumulatedNumberOfCumulativeDeaths: number, data: Covid19Data) => {
        return accumulatedNumberOfCumulativeDeaths + data.numberOfCumulativeDeaths
    }, 0)
}

const findTimestamp = (covid19Data: Covid19Data[], extract: (...values: number[]) => number): number => {
    const timestampInMilliseconds = covid19Data.map((data: Covid19Data) => {
        return data.timestampInMillisecond
    })
    return extract(...timestampInMilliseconds)
}

export default Covid19DashboardContainer
