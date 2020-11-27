import React from 'react'
import { Covid19Data } from '../../models/internal/covid19-internal-models';
import Covid19Chart, { generateChartData } from '../Covid19Chart';

describe('Covid19Chart', () => {
    it('should generate the chart data correctly', () => {
        // given
        const covid19Data = [
            /* 2020 Jan */
            new Covid19Data('AMRO', 'US', 1577836800000, 0, 0, 0, 0),
            /* 2020 Feb */
            new Covid19Data('AMRO', 'US', 1580515200000, 0, 0, 0, 0),
            /* 2020 Mar */
            new Covid19Data('AMRO', 'US', 1583020800000, 0, 0, 0, 0),
            /* 2020 Apr */
            new Covid19Data('AMRO', 'US', 1585699200000, 0, 0, 0, 0),
            /* 2020 May */
            new Covid19Data('AMRO', 'US', 1588291200000, 0, 0, 0, 0),
            /* 2020 Jun */
            new Covid19Data('AMRO', 'US', 1590969600000, 0, 0, 0, 0),
            /* 2020 Jul */
            new Covid19Data('AMRO', 'US', 1593561600000, 0, 0, 0, 0),
            /* 2020 Aug */
            new Covid19Data('AMRO', 'US', 1596240000000, 0, 0, 0, 0),
            /* 2020 Sep */
            new Covid19Data('AMRO', 'US', 1598918400000, 0, 0, 0, 0),
            /* 2020 Oct */
            new Covid19Data('AMRO', 'US', 1601510400000, 1, 1, 10, 10),
            /* 2020 Nov */
            new Covid19Data('EMRO', 'AF', 1606262400000, 2, 3, 20, 30),
            new Covid19Data('AMRO', 'US', 1606348800000, 3, 6, 30, 60),
            /* 2020 Dec */
            new Covid19Data('AMRO', 'US', 1609113600000, 4, 10, 40, 100),
            new Covid19Data('AMRO', 'US', 1609200000000, 5, 15, 50, 150),
            new Covid19Data('AMRO', 'US', 1609286400000, 6, 21, 60, 210),
            /* 2021 Jan */
            new Covid19Data('AMRO', 'US', 1609459200000, 1, 22, 10, 220)
        ]
        const earliestRecordTimestamp = covid19Data[0].timestampInMillisecond
        const latestRecordTimestamp = covid19Data[covid19Data.length - 1].timestampInMillisecond
        const props = {
            covid19Data: covid19Data,
            earliestRecordTimestamp: earliestRecordTimestamp,
            latestRecordTimestamp: latestRecordTimestamp
        }

        // when
        const chartData = generateChartData(props)

        // then
        expect(chartData.labels).toEqual(['Jan/2020', 'Feb/2020', 'Mar/2020', 'Apr/2020', 'May/2020', 'Jun/2020', 'Jul/2020', 'Aug/2020', 'Sep/2020', 'Oct/2020', 'Nov/2020', 'Dec/2020', 'Jan/2021'])

        const dataset = chartData.datasets
        const confirmCases = dataset[0].data
        expect(confirmCases).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 50, 150, 10])

        const deathCases = dataset[1].data
        expect(deathCases).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 15, 1])
    })
})
