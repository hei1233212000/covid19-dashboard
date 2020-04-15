import React from 'react'
import './Covid19AppFooter.scss'
import packageJson from '../../package.json'

const Covid19AppFooter = (): JSX.Element => {
    return <footer className="covid19-app-footer p-grid">
        <div className="p-col-8">Powered by React and PrimeReact</div>
        <div className="p-col-4 version">version: {packageJson.version}</div>
    </footer>
}

export default Covid19AppFooter
