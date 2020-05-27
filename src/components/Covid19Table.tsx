import React from 'react'
import { Country } from '../models/internal/country-internal-models'
import { Covid19Data } from '../models/internal/covid19-internal-models'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import './Covid19Table.scss'
import Utils from '../utils/Utils'

interface Covid19TableProps {
    countries: Country[],
    covid19Data: Covid19Data[],
}

const Covid19Table = (props: Covid19TableProps): JSX.Element => {
    const countryBodyTemplate = (covid19Data: Covid19Data): JSX.Element => {
        const countryCode = covid19Data.countryCode
        const country = props.countries.find(country => country.countryCode === countryCode)
        if (country) {
            const countryName = country.name
            const countryFlagUrl = country.flagUrl
            return <div className="covid19-table-column-country">
                <span className="country-icon"><img src={countryFlagUrl} alt={`country-icon-${countryCode}`}
                                                    className='covid19-table-country-flag'/></span>
                <span>{countryName}</span>
            </div>
        } else {
            return <div>{countryCode}</div>
        }
    }

    const filterCountry = (countryCode: string, filter: string): boolean => {
        const country = props.countries.find(country => country.countryCode === countryCode)
        if (country) {
            const countryName = country.name
            return countryName.toUpperCase().includes(filter.toUpperCase())
        } else {
            return false
        }
    }

    const multiSortMeta = [
        {field: 'numberOfCumulativeDeaths', order: -1},
        {field: 'numberOfCumulativeConfirms', order: -1}
    ]

    return <div className="covid19-table" data-testid="covid19-table">
        <DataTable value={props.covid19Data} emptyMessage="No data found"
                   sortMode="multiple" multiSortMeta={multiSortMeta} removableSort
                   rowHover resizableColumns
                   paginator alwaysShowPaginator rows={10} rowsPerPageOptions={[10, 25, 50, 100, 200, 300]}
                   paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                   currentPageReportTemplate="{first} to {last} of {totalRecords} entries"
        >
            <Column field="countryCode" header="Countries, areas or territories" body={countryBodyTemplate}
                    filter filterMatchMode="custom" filterFunction={filterCountry} filterPlaceholder="Country"
            />
            <Column field="numberOfCumulativeConfirms" header="Cumulative Confirms" sortable
                    body={numberOfCumulativeConfirmsBodyTemplate} style={{width: '25%'}}
                    filter filterMatchMode="gte" filterPlaceholder="Min."
            />
            <Column field="numberOfCumulativeDeaths" header="Cumulative Deaths" sortable
                    body={numberOfCumulativeDeathsBodyTemplate} style={{width: '25%'}}
                    filter filterMatchMode="gte" filterPlaceholder="Min."
            />
        </DataTable>
    </div>
}

const numberOfCumulativeConfirmsBodyTemplate = (covid19Data: Covid19Data): JSX.Element => {
    return <div>{Utils.formatNumberWithCommas(covid19Data.numberOfCumulativeConfirms)}</div>
}

const numberOfCumulativeDeathsBodyTemplate = (covid19Data: Covid19Data): JSX.Element => {
    return <div>{Utils.formatNumberWithCommas(covid19Data.numberOfCumulativeDeaths)}</div>
}

export default Covid19Table
