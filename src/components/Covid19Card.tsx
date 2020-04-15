import React from 'react'
import { Card } from 'primereact/card'
import './Covid19Card.scss'

interface Covid19CardProps {
    title?: string,
    subTitle?: string,
    children?: string | JSX.Element,
    footer?: string | JSX.Element,
}

const Covid19Card = (props: Covid19CardProps): JSX.Element => {
    return <div>
        <Card title={props.title} subTitle={props.subTitle} className="covid19-card" footer={props.footer}>
            {props.children}
        </Card>
    </div>
}

export default Covid19Card
