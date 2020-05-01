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

const Covid19DashboardContainer = (): JSX.Element => {
    const countries = useCountries()
    const {covid19Data, refreshCovid19DataFunction} = useCovid19Data()
    const covid19DashboardState = new Covid19DashboardState(countries, covid19Data, refreshCovid19DataFunction)

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

class Covid19DataAndCallback {
    readonly covid19Data: Covid19Data[]
    readonly refreshCovid19DataFunction: () => void

    constructor(covid19Data: Covid19Data[], refreshCovid19Data: () => void) {
        this.covid19Data = covid19Data
        this.refreshCovid19DataFunction = refreshCovid19Data
    }
}

export default Covid19DashboardContainer
