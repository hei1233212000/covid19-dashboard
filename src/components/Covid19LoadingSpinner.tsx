import React from 'react'
import { ProgressSpinner } from 'primereact/progressspinner'

const Covid19LoadingSpinner = (): JSX.Element => {
    return <div className="covid19-spinner p-grid">
        <ProgressSpinner/>
    </div>
}

export default Covid19LoadingSpinner
