import React, { useContext } from 'react'
import Covid19Table from './Covid19Table'
import Covid19Counter, { Covid19CounterLevel } from './Covid19Counter'
import Covid19Card from './Covid19Card'
import { Covid19DashboardContext } from '../context/Covid19DashboardContext'
import Covid19RefreshButton from './Covid19RefreshButton'
import Covid19ChartContainer from './Covid19ChartContainer'

const Covid19Dashboard = (): JSX.Element => {
    const covid19DashboardState = useContext(Covid19DashboardContext)

    return <div className="p-grid p-fluid" data-testid="covid19-dashboard">
        <div className="p-col-12">
            <Covid19RefreshButton
                refreshCovid19FullDataFunction={covid19DashboardState.refreshCovid19FullDataFunction}
                lastUpdatedTimeInMilliseconds={covid19DashboardState.lastUpdatedTimestamp}
            />
        </div>
        <div className="p-col-12 p-md-3" data-testid="confirmed-cases-counter">
            <Covid19Counter title="Confirmed cases" level={Covid19CounterLevel.Warning}
                            earliestRecordTimestamp={covid19DashboardState.earliestRecordTimestamp}
                            latestRecordTimestamp={covid19DashboardState.latestRecordTimestamp}
                            count={covid19DashboardState.totalCumulativeConfirms}
            />
        </div>
        <div className="p-col-12 p-md-3" data-testid="confirmed-deaths-counter">
            <Covid19Counter title="Confirmed deaths" level={Covid19CounterLevel.Danger}
                            earliestRecordTimestamp={covid19DashboardState.earliestRecordTimestamp}
                            latestRecordTimestamp={covid19DashboardState.latestRecordTimestamp}
                            count={covid19DashboardState.totalCumulativeDeaths}
            />
        </div>
        <div className="p-col-12 p-md-3" data-testid="death-rate-counter">
            <Covid19Counter title="Death rate" level={Covid19CounterLevel.Danger}
                            earliestRecordTimestamp={covid19DashboardState.earliestRecordTimestamp}
                            latestRecordTimestamp={covid19DashboardState.latestRecordTimestamp}
                            count={covid19DashboardState.deathRate}
                            isPercentage={true}
            />
        </div>
        <div className="p-col-12 p-md-3" data-testid="vaccine-doses-counter">
            <Covid19Counter title="Vaccine doses" level={Covid19CounterLevel.Success}
                            earliestRecordTimestamp={covid19DashboardState.earliestRecordTimestamp}
                            latestRecordTimestamp={covid19DashboardState.latestRecordTimestamp}
                            count={covid19DashboardState.totalVaccineDoses}
            />
        </div>
        <div className="p-col-12 p-lg-6" data-testid="cumulative-cases">
            <Covid19Card title="Cumulative cases">
                <Covid19Table countries={covid19DashboardState.countries}
                              covid19Data={covid19DashboardState.latestCovid19Data}/>
            </Covid19Card>
        </div>
        <div className="p-col-12 p-lg-6" data-testid="trend-panel">
            <Covid19Card title="Trend (measured by month)">
                <Covid19ChartContainer
                    covid19Data={covid19DashboardState.covid19Data}
                    countries={covid19DashboardState.countries}
                    earliestRecordTimestamp={covid19DashboardState.earliestRecordTimestamp}
                    latestRecordTimestamp={covid19DashboardState.latestRecordTimestamp}
                />
            </Covid19Card>
        </div>
    </div>
}

export default Covid19Dashboard
