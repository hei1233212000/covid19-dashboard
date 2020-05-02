import React from 'react'
import { Covid19Data } from '../models/internal/covid19-internal-models'
import { Chart } from 'primereact/chart'
import Utils from '../utils/Utils'

interface Covid19ChartProps {
    covid19Data: Covid19Data[],
    earliestRecordTimestamp: number,
    latestRecordTimestamp: number,
}

const Covid19Chart = (props: Covid19ChartProps): JSX.Element => {
    return <div className="covid19-chart">
        <Chart type="line" data={generateChartData(props)} options={chartOptions()}/>
    </div>
}

const generateChartData = (props: Covid19ChartProps) => {
    const monthNames = generateMonths(props.earliestRecordTimestamp, props.latestRecordTimestamp)
    const covid19ChartInternalData = generateCovid19ChartInternalData(props.covid19Data)
    const confirmCases: number[] = []
    const deathCases: number[] = []
    monthNames.forEach((monthName: string) => {
        const data = covid19ChartInternalData.find((internalData: Covid19ChartInternalData) => {
            return internalData.monthName === monthName
        })!
        confirmCases.push(data.confirmCases)
        deathCases.push(data.deathCases)
    })

    // TODO: find a way to use the SCSS variables to set the color
    return {
        labels: monthNames,
        datasets: [
            {
                label: 'Confirmed cases',
                data: confirmCases,
                fill: false,
                borderColor: '#f9c851',
            },
            {
                label: 'Death cases',
                data: deathCases,
                fill: false,
                borderColor: '#ef6262'
            }
        ]
    }
}

const generateMonths = (earliestRecordTimestamp: number, latestRecordTimestamp: number): string[] => {
    const firstMonth = toMonthNumber(earliestRecordTimestamp)
    const latestMonth = toMonthNumber(latestRecordTimestamp)
    const months = []
    for (let monthNumber = firstMonth; monthNumber <= latestMonth; monthNumber++) {
        months.push(toMonthString(monthNumber))
    }
    return months
}

const generateCovid19ChartInternalData = (covid19Data: Covid19Data[]): Covid19ChartInternalData[] => {
    const covid19ChartInternalData: Covid19ChartInternalData[] = []
    covid19Data.forEach((data: Covid19Data) => {
        const month = toMonthString(toMonthNumber(data.timestampInMillisecond))
        const monthIsInitialized = covid19ChartInternalData.find((internalData: Covid19ChartInternalData) => {
            return internalData.monthName === month
        })
        if (monthIsInitialized) {
            monthIsInitialized.confirmCases = monthIsInitialized.confirmCases + data.numberOfConfirms
            monthIsInitialized.deathCases = monthIsInitialized.deathCases + data.numberOfDeaths
        } else {
            covid19ChartInternalData.push(new Covid19ChartInternalData(
                month,
                data.numberOfConfirms,
                data.numberOfDeaths
            ))
        }
    })
    return covid19ChartInternalData
}

/**
 * @return 1 based month number
 */
const localOffset = Utils.localOffset()
const toMonthNumber = (timestamp: number): number => {
    return Number(Utils.timestampToStringWithOffset(timestamp, localOffset, 'MM'))
}

const allMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
/**
 * @param monthNumber 1 based
 */
const toMonthString = (monthNumber: number): string => {
    return allMonthNames[monthNumber - 1]
}

const chartOptions = () => {
    return {
        scales: {
            yAxes: [{
                ticks: {
                    maxTicksLimit: 20
                }
            }]
        }
    }
}

export default Covid19Chart

class Covid19ChartInternalData {
    readonly monthName: string
    confirmCases: number
    deathCases: number

    constructor(month: string, confirmCases: number, deathCases: number) {
        this.monthName = month
        this.confirmCases = confirmCases
        this.deathCases = deathCases
    }
}
