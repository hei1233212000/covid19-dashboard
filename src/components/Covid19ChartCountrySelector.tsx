import React from 'react'
import { Dropdown } from 'primereact/dropdown'

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
    return <div className="covid19-chart-country-selector">
        <Dropdown value={props.selectedCountryItem} options={props.countryItems}
                  onChange={props.onSelectCountryItemChange}
                  optionLabel="countryName"
        />
    </div>
}

export default Covid19ChartCountrySelector
