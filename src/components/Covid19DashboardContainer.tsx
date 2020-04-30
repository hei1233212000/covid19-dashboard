import React, { useEffect, useState } from 'react'
import { Country } from '../models/internal/country-internal-models'
import CountryApi from '../api/CountryApi'
import { Covid19Data } from '../models/internal/covid19-internal-models'
import { Covid19Api } from '../api/Covid19Api'
import Covid19Dashboard from './Covid19Dashboard'
import Covid19LoadingSpinner from './Covid19LoadingSpinner'
import { Covid19DashboardContent, Covid19DashboardContext } from '../context/Covid19DashboardContext'

const Covid19DashboardContainer = (): JSX.Element => {
    const countries = useCountries()
    const covid19Data = useCovid19Data()
    const covid19DashboardContent = new Covid19DashboardContent(countries, covid19Data)

    if (covid19DashboardContent.ready) {
        return <Covid19DashboardContext.Provider value={covid19DashboardContent}>
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

const useCovid19Data = (): Covid19Data[] => {
    const initialState: Covid19Data[] = []
    const [covid19Data, setCovid19Data] = useState(initialState)
    useEffect(() => {
        Covid19Api.findCovid19Data()
            .then(data => setCovid19Data(data))
    }, [])
    return covid19Data
}

export default Covid19DashboardContainer
