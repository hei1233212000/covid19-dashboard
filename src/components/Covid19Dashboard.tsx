import React, { useContext } from 'react'
import Covid19Table from './Covid19Table'
import Covid19Counter, { Covid19CounterLevel } from './Covid19Counter'
import Covid19Card from './Covid19Card'
import Covid19Chart from './Covid19Chart'
import { Covid19DashboardContext } from '../context/Covid19DashboardContext'
import Covid19RefreshButton from './Covid19RefreshButton'

const Covid19Dashboard = (): JSX.Element => {
    const covid19DashboardState = useContext(Covid19DashboardContext)

    return <div className="p-grid p-fluid">
        <div className="p-col-12">
            <Covid19RefreshButton
                refreshCovid19DataFunction={covid19DashboardState.refreshCovid19DataFunction}
                lastUpdatedTimeInMilliseconds={covid19DashboardState.lastUpdatedTimestamp}
            />
        </div>
        <div className="p-col-12 p-lg-4" data-testid="confirmed-cases-counter">
            <Covid19Counter title="Confirmed cases" level={Covid19CounterLevel.Warning}
                            earliestRecordTimestamp={covid19DashboardState.earliestRecordTimestamp}
                            latestRecordTimestamp={covid19DashboardState.latestRecordTimestamp}
                            count={covid19DashboardState.totalCumulativeConfirms}
            />
        </div>
        <div className="p-col-12 p-lg-4" data-testid="confirmed-deaths-counter">
            <Covid19Counter title="Confirmed deaths" level={Covid19CounterLevel.Danger}
                            earliestRecordTimestamp={covid19DashboardState.earliestRecordTimestamp}
                            latestRecordTimestamp={covid19DashboardState.latestRecordTimestamp}
                            count={covid19DashboardState.totalCumulativeDeaths}
            />
        </div>
        <div className="p-col-12 p-lg-4" data-testid="countries-areas-territories-counter">
            <Covid19Counter title="Countries, areas or territories with cases" level={Covid19CounterLevel.Normal}
                            earliestRecordTimestamp={covid19DashboardState.earliestRecordTimestamp}
                            latestRecordTimestamp={covid19DashboardState.latestRecordTimestamp}
                            count={covid19DashboardState.numberOfCountriesWithCases}
            />
        </div>
        <div className="p-col-12 p-lg-6" data-testid="cumulative-cases">
            <Covid19Card title="Cumulative cases">
                <Covid19Table countries={covid19DashboardState.countries}
                              covid19Data={covid19DashboardState.latestCovid19Data}/>
            </Covid19Card>
        </div>
        <div className="p-col-12 p-lg-6">
            <Covid19Card title="Trend (measured by month)">
                <Covid19Chart
                    covid19Data={covid19DashboardState.covid19Data}
                    earliestRecordTimestamp={covid19DashboardState.earliestRecordTimestamp}
                    latestRecordTimestamp={covid19DashboardState.latestRecordTimestamp}
                />
            </Covid19Card>
        </div>
    </div>
}

export default Covid19Dashboard
