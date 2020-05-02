import React, { useEffect, useState } from 'react'
import { Country } from '../models/internal/country-internal-models'
import CountryApi from '../api/CountryApi'
import { Covid19Data } from '../models/internal/covid19-internal-models'
import { Covid19Api } from '../api/Covid19Api'
import Covid19Dashboard from './Covid19Dashboard'
import Covid19LoadingSpinner from './Covid19LoadingSpinner'
import {
    Covid19DashboardContext,
    Covid19DashboardState,
    RefreshCovid19DataFunction
} from '../context/Covid19DashboardContext'
import EnvVariables from '../env/EnvVariables'
import Utils from '../utils/Utils'

const Covid19DashboardContainer = (): JSX.Element => {
    const countries = useCountries()
    const {covid19Data, refreshCovid19DataFunction} = useCovid19Data()
    const lastUpdatedTimestamp = Utils.currentUtcTimestampInMilliseconds()
    const covid19DashboardState = new Covid19DashboardState(countries, covid19Data, refreshCovid19DataFunction, lastUpdatedTimestamp)
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
            .then(data => setCountries(data))
    }, [])
    return countries
}

const useCovid19Data = (): Covid19DataAndCallback => {
    const initialState: Covid19Data[] = []
    const [covid19Data, setCovid19Data] = useState(initialState)
    const refreshCovid19Data: RefreshCovid19DataFunction = (manualRefresh?: boolean) => {
        if (manualRefresh) {
            setCovid19Data([])
        }
        Covid19Api.findCovid19Data()
            .then(data => setCovid19Data(data))
    }

    useEffect(() => {
        refreshCovid19Data()
    }, [])
    return new Covid19DataAndCallback(covid19Data, refreshCovid19Data)
}

const useAutoRefreshCovid19Data = (
    covid19DashboardState: Covid19DashboardState,
    refreshIntervalInMilliseconds: number
) => {
    useEffect(() => {
        if (covid19DashboardState.ready) {
            const intervalId = setInterval(() => {
                covid19DashboardState.refreshCovid19DataFunction()
            }, refreshIntervalInMilliseconds)
            return () => clearInterval(intervalId)
        }
    }, [covid19DashboardState, refreshIntervalInMilliseconds])
}

class Covid19DataAndCallback {
    readonly covid19Data: Covid19Data[]
    readonly refreshCovid19DataFunction: RefreshCovid19DataFunction

    constructor(covid19Data: Covid19Data[], refreshCovid19Data: RefreshCovid19DataFunction) {
        this.covid19Data = covid19Data
        this.refreshCovid19DataFunction = refreshCovid19Data
    }
}

export default Covid19DashboardContainer
