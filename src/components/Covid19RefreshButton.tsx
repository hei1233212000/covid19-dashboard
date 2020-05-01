import React from 'react'
import './Covid19RefreshButton.scss'
import { RefreshCovid19DataFunction } from '../context/Covid19DashboardContext'

interface Covid19RefreshButtonProps {
    refreshCovid19DataFunction: RefreshCovid19DataFunction
}

const Covid19RefreshButton = (props: Covid19RefreshButtonProps): JSX.Element => {
    const refreshCovid19Data = () => {
        const manualRefresh = true
        props.refreshCovid19DataFunction(manualRefresh)
    }

    return <div className="covid19-refresh-button">
        <i className="pi pi-refresh refresh" role="button" onClick={refreshCovid19Data}>&nbsp;Refresh</i>
    </div>
}

export default Covid19RefreshButton
