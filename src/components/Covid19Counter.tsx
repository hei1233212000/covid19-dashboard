import React from 'react'
import Covid19Card from './Covid19Card'
import './Covid19Counter.scss'
import Utils from '../utils/Utils'

export enum Covid19CounterLevel {
    Success,
    Normal,
    Warning,
    Danger
}

interface Covid19CounterProps {
    title: string,
    count: number,
    level: Covid19CounterLevel,
    earliestRecordTimestamp: number,
    latestRecordTimestamp: number,
    isPercentage?: boolean,
}

const Covid19Counter = (props: Covid19CounterProps): JSX.Element => {
    const countColorCssClass = generateCountColorCssClass(props.level)
    const counterRemarks = generateCounterRemarks(props.earliestRecordTimestamp, props.latestRecordTimestamp)
    let counterValue: string;
    if (props.isPercentage) {
        counterValue = Utils.formatPercentage(props.count);
    } else {
        counterValue = Utils.formatNumberWithCommas(props.count);
    }
    return <div className="covid19-counter">
        <Covid19Card title={props.title} subTitle={counterRemarks}>
            <div className={`count ${countColorCssClass}`}>{counterValue}</div>
        </Covid19Card>
    </div>
}

const generateCountColorCssClass = (type: Covid19CounterLevel) => {
    switch (type) {
        case Covid19CounterLevel.Success:
            return 'success'
        case Covid19CounterLevel.Normal:
            return 'normal'
        case Covid19CounterLevel.Warning:
            return 'warning'
        case Covid19CounterLevel.Danger:
            return 'danger'
    }
}

const dateFormat = 'DD-MMM-YYYY'
const localOffset = Utils.localOffset()
const generateCounterRemarks = (earliestRecordTimestamp: number,
                                latestRecordTimestamp: number): string => {
    const fromDate = Utils.timestampToStringWithOffset(earliestRecordTimestamp, localOffset, dateFormat)
    const toDate = Utils.timestampToStringWithOffset(latestRecordTimestamp, localOffset, dateFormat)
    return `${fromDate} to ${toDate}`
}

export default Covid19Counter
