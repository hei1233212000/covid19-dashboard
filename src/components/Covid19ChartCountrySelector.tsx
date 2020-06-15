import React, { useState } from 'react'
import { AutoComplete } from 'primereact/autocomplete';

interface Covid19ChartCountrySelectorProps {
    selectedCountryItem: CountryDropdownItem,
    countryItems: CountryDropdownItem[],
    onSelectCountryItemChange: (e: { value: CountryDropdownItem }) => void
}

export interface CountryDropdownItem {
    countryName: string,
    countryCode: string,
}

const Covid19ChartCountrySelector = (props: Covid19ChartCountrySelectorProps): JSX.Element => {
    const [suggestions, setSuggestions] = useState(props.countryItems)
    const filterSuggestions = (e: { query: string }) => {
        const filteredCountryItems = props.countryItems
            .filter(country => country.countryName.toLowerCase().includes(e.query.toLowerCase()))
        setSuggestions(filteredCountryItems)
    }
    const selectText = (e: any) => {
        e.target.select()
    }

    return <div className="covid19-chart-country-selector">
        <AutoComplete value={props.selectedCountryItem}
                      field="countryName"
                      suggestions={suggestions}
                      completeMethod={filterSuggestions}
                      placeholder="Country"
                      dropdown={true}
                      onChange={props.onSelectCountryItemChange}
                      onClick={selectText}
        />
    </div>
}

export default Covid19ChartCountrySelector
