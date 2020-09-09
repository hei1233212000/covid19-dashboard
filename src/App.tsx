import React from 'react'
import 'primereact/resources/themes/mdc-light-indigo/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import './styles/layout/layout.scss'
import Covid19DashboardContainer from './components/Covid19DashboardContainer'
import Covid19AppFooter from './components/Covid19AppFooter'
import Covid19AppHeader from './components/Covid19AppHeader'

export default (): JSX.Element => {
    return <div className="layout-wrapper">
        <div className="layout-header">
            <Covid19AppHeader/>
        </div>
        <div className="layout-main">
            <Covid19DashboardContainer/>
        </div>
        <div className="layout-footer">
            <Covid19AppFooter/>
        </div>
    </div>
}
