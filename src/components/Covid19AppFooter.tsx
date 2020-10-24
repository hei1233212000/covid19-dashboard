import React from 'react'
import './Covid19AppFooter.scss'
import packageJson from '../../package.json'

const Covid19AppFooter = (): JSX.Element => {
    return <footer className="covid19-app-footer p-grid p-nogutter">
        <div className="p-col-8">Powered by <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">React</a> and <a href="https://www.primefaces.org/primereact/" target="_blank" rel="noopener noreferrer">PrimeReact</a></div>
        <div className="p-col-4 version">version: {packageJson.version}</div>
    </footer>
}

export default Covid19AppFooter
