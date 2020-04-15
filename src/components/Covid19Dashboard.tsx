import React from 'react'
import { Country } from '../models/internal/country-internal-models'
import { Covid19Data } from '../models/internal/covid19-internal-models'
import Covid19Table from './Covid19Table'
import Covid19Counter, { Covid19CounterLevel } from './Covid19Counter'
import Covid19Card from './Covid19Card';
import Covid19Chart from './Covid19Chart';

interface Covid19DashboardProps {
    countries: Country[],
    covid19Data: Covid19Data[],
    latestCovid19Data: Covid19Data[],
    earliestRecordTimestamp: number,
    latestRecordTimestamp: number,
    totalCumulativeConfirms: number,
    totalCumulativeDeaths: number,
    numberOfCountriesWithCases: number,
}

const Covid19Dashboard = (props: Covid19DashboardProps): JSX.Element => {
    return <div className="p-grid p-fluid">
        <div className="p-col-12 p-lg-4">
            <Covid19Counter title="Confirmed cases" level={Covid19CounterLevel.Warning}
                            earliestRecordTimestamp={props.earliestRecordTimestamp}
                            latestRecordTimestamp={props.latestRecordTimestamp}
                            count={props.totalCumulativeConfirms}/>
        </div>
        <div className="p-col-12 p-lg-4">
            <Covid19Counter title="Confirmed deaths" level={Covid19CounterLevel.Danger}
                            earliestRecordTimestamp={props.earliestRecordTimestamp}
                            latestRecordTimestamp={props.latestRecordTimestamp}
                            count={props.totalCumulativeDeaths}/>
        </div>
        <div className="p-col-12 p-lg-4">
            <Covid19Counter title="Countries, areas or territories with cases" level={Covid19CounterLevel.Normal}
                            earliestRecordTimestamp={props.earliestRecordTimestamp}
                            latestRecordTimestamp={props.latestRecordTimestamp}
                            count={props.numberOfCountriesWithCases}/>
        </div>
        <div className="p-col-12 p-lg-6">
            <Covid19Card title="Cumulative cases">
                <Covid19Table countries={props.countries} covid19Data={props.latestCovid19Data}/>
            </Covid19Card>
        </div>
        <div className="p-col-12 p-lg-6">
            <Covid19Card title="Trend">
                <Covid19Chart
                    covid19Data={props.covid19Data}
                    earliestRecordTimestamp={props.earliestRecordTimestamp}
                    latestRecordTimestamp={props.latestRecordTimestamp}
                />
            </Covid19Card>
        </div>
    </div>
}

export default Covid19Dashboard
