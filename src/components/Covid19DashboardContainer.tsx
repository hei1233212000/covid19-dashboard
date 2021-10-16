import React, { useEffect, useState } from 'react'
import { Country } from '../models/internal/country-internal-models'
import CountryApi from '../api/CountryApi'
import { Covid19FullData } from '../models/internal/covid19-internal-models'
import { Covid19Api } from '../api/Covid19Api'
import Covid19Dashboard from './Covid19Dashboard'
import Covid19LoadingSpinner from './Covid19LoadingSpinner'
import {
    Covid19DashboardContext,
    Covid19DashboardState,
    RefreshCovid19FullDataFunction
} from '../context/Covid19DashboardContext'
import EnvVariables from '../env/EnvVariables'
import Utils from '../utils/Utils'

const Covid19DashboardContainer = (): JSX.Element => {
    const countries = useCountries()
    const {covid19FullData, refreshCovid19FullDataFunction} = useCovid19FullData()
    const lastUpdatedTimestamp = Utils.currentUtcTimestampInMilliseconds()
    const covid19DashboardState = new Covid19DashboardState(countries, covid19FullData, refreshCovid19FullDataFunction, lastUpdatedTimestamp)
    useAutoRefreshCovid19Data(covid19DashboardState, EnvVariables.refreshCovid19DataIntervalInMilliseconds)

    if (covid19DashboardState.ready) {
        return <Covid19DashboardContext.Provider value={covid19DashboardState}>
            <Covid19Dashboard/>
        </Covid19DashboardContext.Provider>
    } else {
        return <Covid19LoadingSpinner/>
    }
}

const useCountries = (): Country[] => {
    const initialState: Country[] = []
    const [countries, setCountries] = useState(initialState)
    useEffect(() => {
        CountryApi.findCountries()
            .then(data => {
                const dataClone = [...data]
                dataClone.push(unknownCountry())
                setCountries(dataClone)
            })
    }, [])
    return countries
}

const useCovid19FullData = (): Covid19FullDataAndCallback => {
    const initialState: Covid19FullData = {} as Covid19FullData
    const [covid19FullData, setCovid19FullData] = useState(initialState)
    const refreshCovid19Data: RefreshCovid19FullDataFunction = (manualRefresh?: boolean) => {
        if (manualRefresh) {
            setCovid19FullData({} as Covid19FullData)
        }
        Covid19Api.findCovid19Data()
            .then(data => setCovid19FullData(data))
    }

    useEffect(() => {
        refreshCovid19Data()
    }, [])
    return new Covid19FullDataAndCallback(covid19FullData, refreshCovid19Data)
}

const useAutoRefreshCovid19Data = (
    covid19DashboardState: Covid19DashboardState,
    refreshIntervalInMilliseconds: number
) => {
    useEffect(() => {
        if (covid19DashboardState.ready) {
            const intervalId = setInterval(() => {
                covid19DashboardState.refreshCovid19FullDataFunction()
            }, refreshIntervalInMilliseconds)
            return () => clearInterval(intervalId)
        }
    }, [covid19DashboardState, refreshIntervalInMilliseconds])
}

/**
 * This is a workaround about the data provider would have data with count code ' '
 */
const unknownCountry = (): Country => {
    return new Country('', ' ', 'Others', '')
}

class Covid19FullDataAndCallback {
    readonly covid19FullData: Covid19FullData
    readonly refreshCovid19FullDataFunction: RefreshCovid19FullDataFunction

    constructor(covid19FullData: Covid19FullData, refreshCovid19Data: RefreshCovid19FullDataFunction) {
        this.covid19FullData = covid19FullData
        this.refreshCovid19FullDataFunction = refreshCovid19Data
    }
}

export default Covid19DashboardContainer
