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

const columnTitleClassname = 'p-column-title'
const countryColumnHeader = 'Countries, areas or territories'
const cumulativeConfirmsColumnHeader = 'Cumulative confirms'
const cumulativeDeathsColumnHeader = 'Cumulative deaths'
const deathRateColumnHeader = 'Death rate'

const Covid19Table = (props: Covid19TableProps): JSX.Element => {
    const countryBodyTemplate = (covid19Data: Covid19Data): JSX.Element => {
        const countryCode = covid19Data.countryCode
        const country = props.countries.find(country => country.countryCode === countryCode)
        let body: JSX.Element
        if (country) {
            const countryName = country.name
            let iconElement = <span/>
            if (country.flagUrl) {
                const countryFlagUrl = country.flagUrl
                iconElement =
                    <span className="country-icon"><img src={countryFlagUrl} alt={`country-icon-${countryCode}`}
                                                        className='covid19-table-country-flag'/></span>
            }

            body = <div className="covid19-table-column-country">
                {iconElement}
                <span>{countryName}</span>
            </div>
        } else {
            body = <div>{countryCode}</div>
        }
        return <div>
            <div className={columnTitleClassname}>{countryColumnHeader}</div>
            {body}
        </div>
    }

    const filterCountry = (countryCode: string, filter: string): boolean => {
        const country = props.countries.find(country => country.countryCode === countryCode)
        if (country) {
            const countryName = country.name
            return countryName.toUpperCase().includes(filter.toUpperCase())
        } else {
            // this is only for handling the country code "Other*"
            return countryCode.toUpperCase().includes(filter.toUpperCase())
        }
    }

    const multiSortMeta = [
        {field: 'numberOfCumulativeDeaths', order: -1},
        {field: 'numberOfCumulativeConfirms', order: -1},
    ]

    return <div className="covid19-table" data-testid="covid19-table">
        <DataTable value={props.covid19Data} emptyMessage="No data found"
                   sortMode="multiple" multiSortMeta={multiSortMeta} removableSort
                   rowHover resizableColumns
                   paginator alwaysShowPaginator rows={10} rowsPerPageOptions={[10, 25, 50, 100, 200, 300]}
                   paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                   currentPageReportTemplate="{first} to {last} of {totalRecords} entries"
        >
            <Column field="countryCode" header={countryColumnHeader} body={countryBodyTemplate}
                    filter filterMatchMode="custom" filterFunction={filterCountry} filterPlaceholder="Country"
            />
            <Column field="numberOfCumulativeConfirms" header={cumulativeConfirmsColumnHeader} sortable
                    body={numberOfCumulativeConfirmsBodyTemplate} style={{width: '20%'}}
                    filter filterMatchMode="gte" filterPlaceholder="Min."
            />
            <Column field="numberOfCumulativeDeaths" header={cumulativeDeathsColumnHeader} sortable
                    body={numberOfCumulativeDeathsBodyTemplate} style={{width: '20%'}}
                    filter filterMatchMode="gte" filterPlaceholder="Min."
            />
            <Column field="deathRate" header={deathRateColumnHeader} sortable
                    body={deathRateBodyTemplate} style={{width: '20%'}}
                    filter filterMatchMode="custom" filterFunction={deathRateFilterFunction} filterPlaceholder="Min."
            />
        </DataTable>
    </div>
}

const numberOfCumulativeConfirmsBodyTemplate = (covid19Data: Covid19Data): JSX.Element => {
    return <div>
        <div className={columnTitleClassname}>{cumulativeConfirmsColumnHeader}</div>
        <div>{Utils.formatNumberWithCommas(covid19Data.numberOfCumulativeConfirms)}</div>
    </div>
}

const numberOfCumulativeDeathsBodyTemplate = (covid19Data: Covid19Data): JSX.Element => {
    return <div>
        <div className={columnTitleClassname}>{cumulativeDeathsColumnHeader}</div>
        <div>{Utils.formatNumberWithCommas(covid19Data.numberOfCumulativeDeaths)}</div>
    </div>
}

const deathRateBodyTemplate = (covid19Data: Covid19Data): JSX.Element => {
    return <div>
        <div className={columnTitleClassname}>{deathRateColumnHeader}</div>
        <div>{Utils.formatPercentage(covid19Data.deathRate)}</div>
    </div>
}

const deathRateFilterFunction = (deathRateInDecimal: number, filter: string): boolean => {
    return deathRateInDecimal * 100 >= Number.parseFloat(filter)
}

export default Covid19Table
