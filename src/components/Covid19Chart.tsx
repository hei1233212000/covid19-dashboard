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
    return <div className="covid19-chart" data-testid="covid19-chart">
        <Chart type="line" data={generateChartData(props)} options={chartOptions()}/>
    </div>
}

/**
 * export it just for testing
 */
export const generateChartData = (props: Covid19ChartProps) => {
    const monthAndYears = generateMonthAndYears(props.earliestRecordTimestamp, props.latestRecordTimestamp)
    const covid19ChartInternalData = generateCovid19ChartInternalData(props.covid19Data)
    const confirmCases: number[] = []
    const deathCases: number[] = []
    monthAndYears.forEach((monthAndYear: string) => {
        const data = covid19ChartInternalData.find((internalData: Covid19ChartInternalData) => {
            return internalData.monthAndYear === monthAndYear
        })!
        if (data) {
            confirmCases.push(data.confirmCases)
            deathCases.push(data.deathCases)
        }
    })

    // TODO: find a way to use the SCSS variables to set the color
    return {
        labels: monthAndYears,
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

/**
 * e.g. ['Jan/2020', 'Feb/2020']
 */
const generateMonthAndYears = (earliestRecordTimestamp: number, latestRecordTimestamp: number): string[] => {
    const firstYearMonthNumber = toYearMonthNumber(earliestRecordTimestamp)
    const latestYearMonthNumber = toYearMonthNumber(latestRecordTimestamp)
    const monthYears = []
    let yearMonthNumber = firstYearMonthNumber
    while (yearMonthNumber <= latestYearMonthNumber) {
        const yearMonthNumberInString = yearMonthNumber.toString()
        const year = yearMonthNumberInString.substring(0, 4)
        const monthNumber = Number(yearMonthNumberInString.substring(4))
        const monthYear = toMonthString(monthNumber) + '/' + year
        monthYears.push(monthYear)

        if (monthNumber === 12) {
            yearMonthNumber = yearMonthNumber + 100 /* increase year */ - 11 /* reset to Jan */
        } else {
            yearMonthNumber++
        }
    }
    return monthYears
}

const generateCovid19ChartInternalData = (covid19Data: Covid19Data[]): Covid19ChartInternalData[] => {
    const covid19ChartInternalData: Covid19ChartInternalData[] = []
    covid19Data.forEach((data: Covid19Data) => {
        const monthAndYear = toMonthAndYear(data.timestampInMillisecond)
        const currentMonthData = covid19ChartInternalData.find((internalData: Covid19ChartInternalData) => {
            return internalData.monthAndYear === monthAndYear
        })
        if (currentMonthData) {
            currentMonthData.confirmCases = currentMonthData.confirmCases + data.numberOfConfirms
            currentMonthData.deathCases = currentMonthData.deathCases + data.numberOfDeaths
        } else {
            covid19ChartInternalData.push(new Covid19ChartInternalData(
                monthAndYear,
                data.numberOfConfirms,
                data.numberOfDeaths
            ))
        }
    })
    return covid19ChartInternalData
}

const localOffset = Utils.localOffset()

/**
 * e.g. 202001, 202012
 */
const toYearMonthNumber = (timestamp: number): number => {
    return Number(Utils.timestampToStringWithOffset(timestamp, localOffset, 'YYYYMM'))
}

/**
 * e.g. Jan/2020
 */
const toMonthAndYear = (timestamp: number): string => {
    return Utils.timestampToStringWithOffset(timestamp, localOffset, 'MMM/YYYY')
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
                    maxTicksLimit: 20,
                    callback: (value: any) => {
                        return Utils.formatNumberWithCommas(value)
                    }
                }
            }]
        },
        tooltips: {
            callbacks: {
                label: (tooltipItem: any, data: any) => {
                    let label = data.datasets[tooltipItem.datasetIndex].label || ''
                    if (label) {
                        label += ': '
                    }

                    const caseAmount = Math.round(tooltipItem.yLabel * 100) / 100;
                    label += Utils.formatNumberWithCommas(caseAmount);
                    return label
                }
            }
        }
    }
}

export default Covid19Chart

class Covid19ChartInternalData {
    readonly monthAndYear: string
    confirmCases: number
    deathCases: number

    constructor(monthAndYear: string, confirmCases: number, deathCases: number) {
        this.monthAndYear = monthAndYear
        this.confirmCases = confirmCases
        this.deathCases = deathCases
    }
}
