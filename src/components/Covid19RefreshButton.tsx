import React from 'react'
import './Covid19RefreshButton.scss'
import { RefreshCovid19DataFunction } from '../context/Covid19DashboardContext'
import Utils from '../utils/Utils'

interface Covid19RefreshButtonProps {
    refreshCovid19DataFunction: RefreshCovid19DataFunction,
    lastUpdatedTimeInMilliseconds: number
}

const offset = Utils.localOffset()
const dateTimeFormat = 'DD-MMM-YYYY HH:mm:ss'
const Covid19RefreshButton = (props: Covid19RefreshButtonProps): JSX.Element => {
    const refreshCovid19Data = () => {
        const manualRefresh = true
        props.refreshCovid19DataFunction(manualRefresh)
    }

    const lastUpdatedTime = Utils.timestampToStringWithOffset(props.lastUpdatedTimeInMilliseconds, offset, dateTimeFormat)
    return <div className="covid19-refresh-button">
        <span>Last updated time: {lastUpdatedTime}</span>
        <i className="pi pi-refresh refresh" role="button" onClick={refreshCovid19Data}>&nbsp;Refresh</i>
    </div>
}

export default Covid19RefreshButton
