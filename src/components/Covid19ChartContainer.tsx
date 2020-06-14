import React, { useState } from 'react'
import { Covid19Data } from '../models/internal/covid19-internal-models'
import { Country } from '../models/internal/country-internal-models'
import Covid19Chart from './Covid19Chart'
import Covid19ChartCountrySelector, { CountryDropdownItem } from './Covid19ChartCountrySelector'

interface Covid19ChartContainerProps {
    covid19Data: Covid19Data[],
    countries: Country[],
    earliestRecordTimestamp: number,
    latestRecordTimestamp: number,
}

const defaultCountryDropdownItem: CountryDropdownItem = {
    countryName: "All impacted countries",
    countryCode: "N/A"
}

const Covid19ChartContainer = (props: Covid19ChartContainerProps): JSX.Element => {
    const [selectedCountryItem, setSelectedCountryItem] = useState(defaultCountryDropdownItem)
    const onSelectCountryItemChange = (e: { value: CountryDropdownItem }) => {
        setSelectedCountryItem(e.value)
    }

    const covid19Data = props.covid19Data
    const countryItems = generateCountryItems(covid19Data, props.countries)
    let filteredCovid19Data = covid19Data
    if (selectedCountryItem.countryCode !== defaultCountryDropdownItem.countryCode) {
        filteredCovid19Data = covid19Data.filter(data => data.countryCode === selectedCountryItem.countryCode)
    }

    return <div className="covid19-chart-container">
        <Covid19ChartCountrySelector
            selectedCountryItem={selectedCountryItem}
            countryItems={countryItems}
            onSelectCountryItemChange={onSelectCountryItemChange}
        />
        <Covid19Chart
            covid19Data={filteredCovid19Data}
            earliestRecordTimestamp={props.earliestRecordTimestamp}
            latestRecordTimestamp={props.latestRecordTimestamp}
        />
    </div>
}

const generateCountryItems = (covid19Data: Covid19Data[], countries: Country[]): CountryDropdownItem[] => {
    const items: CountryDropdownItem[] = []
    covid19Data.forEach(data => {
        const countryCode = data.countryCode
        const itemNotExist = items.findIndex(item => item.countryCode === countryCode) === -1
        if (itemNotExist) {
            const country = countries.find(country => country.countryCode === countryCode)
            const countryName = country ? country.name : countryCode
            const item = {
                countryCode: countryCode,
                countryName: countryName
            }
            items.push(item)
        }
    })
    // sort by country name
    const sortedItems = items.sort((i1, i2) => (i1.countryName > i2.countryName) ? 1 : -1)
    sortedItems.unshift(defaultCountryDropdownItem)
    return sortedItems
}

export default Covid19ChartContainer
