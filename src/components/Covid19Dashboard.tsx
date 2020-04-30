import React, { useContext } from 'react'
import Covid19Table from './Covid19Table'
import Covid19Counter, { Covid19CounterLevel } from './Covid19Counter'
import Covid19Card from './Covid19Card'
import Covid19Chart from './Covid19Chart'
import { Covid19DashboardContext } from '../context/Covid19DashboardContext'

const Covid19Dashboard = (): JSX.Element => {
    const covid19DashboardContent = useContext(Covid19DashboardContext)

    return <div className="p-grid p-fluid">
        <div className="p-col-12 p-lg-4">
            <Covid19Counter title="Confirmed cases" level={Covid19CounterLevel.Warning}
                            earliestRecordTimestamp={covid19DashboardContent.earliestRecordTimestamp}
                            latestRecordTimestamp={covid19DashboardContent.latestRecordTimestamp}
                            count={covid19DashboardContent.totalCumulativeConfirms}/>
        </div>
        <div className="p-col-12 p-lg-4">
            <Covid19Counter title="Confirmed deaths" level={Covid19CounterLevel.Danger}
                            earliestRecordTimestamp={covid19DashboardContent.earliestRecordTimestamp}
                            latestRecordTimestamp={covid19DashboardContent.latestRecordTimestamp}
                            count={covid19DashboardContent.totalCumulativeDeaths}/>
        </div>
        <div className="p-col-12 p-lg-4">
            <Covid19Counter title="Countries, areas or territories with cases" level={Covid19CounterLevel.Normal}
                            earliestRecordTimestamp={covid19DashboardContent.earliestRecordTimestamp}
                            latestRecordTimestamp={covid19DashboardContent.latestRecordTimestamp}
                            count={covid19DashboardContent.numberOfCountriesWithCases}/>
        </div>
        <div className="p-col-12 p-lg-6">
            <Covid19Card title="Cumulative cases">
                <Covid19Table countries={covid19DashboardContent.countries}
                              covid19Data={covid19DashboardContent.latestCovid19Data}/>
            </Covid19Card>
        </div>
        <div className="p-col-12 p-lg-6">
            <Covid19Card title="Trend">
                <Covid19Chart
                    covid19Data={covid19DashboardContent.covid19Data}
                    earliestRecordTimestamp={covid19DashboardContent.earliestRecordTimestamp}
                    latestRecordTimestamp={covid19DashboardContent.latestRecordTimestamp}
                />
            </Covid19Card>
        </div>
    </div>
}

export default Covid19Dashboard
