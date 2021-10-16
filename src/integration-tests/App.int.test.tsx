import React from 'react'
import { getAllByText, getByDisplayValue, getByTestId, getByText, render, screen } from '@testing-library/react'
import { waitFor } from '@testing-library/dom'
import App from '../App'
import { Covid19Data as ExternalCovid19Data } from '../models/external/covid19-external-models'
import { enableFetchMocks } from 'jest-fetch-mock'
import 'jest-canvas-mock'
import packageJson from '../../package.json'
import Utils from '../utils/Utils';

enableFetchMocks()

describe('App integration test', () => {
    beforeEach(async () => {
        fetchMock.resetMocks()

        fetchMock.mockIf(/.*/, (request: Request) => {
            if (request.url.includes('covid')) {
                return Promise.resolve(JSON.stringify(covid19Data))
            } else {
                return Promise.resolve('Error')
            }
        })

        Utils.currentUtcTimestampInMilliseconds = jest.fn().mockReturnValue(1579478400000)
        render(<App/>)

        await waitFor(
            () => expect(fetchMock).toHaveBeenCalledTimes(1)
        )
    })

    it('should have Header', () => {
        expect(screen.getByText('COVID-19 outbreak situation')).toBeInTheDocument()
    })

    it('should have Footer', () => {
        // below is referring to https://www.polvara.me/posts/five-things-you-didnt-know-about-testing-library/
        screen.getByText((content: string, node: Element | null) => {
            if (node == null) {
                throw new Error('null element is detected')
            }
            const hasText = (node: Element) => node.textContent === 'Powered by React and PrimeReact';
            const nodeHasText = hasText(node);
            const childrenDontHaveText = Array.from(node.children).every(
                (child: Element) => !hasText(child)
            );
            return nodeHasText && childrenDontHaveText;
        });
    })

    describe.each([
        ['confirmed-cases-counter', 'Confirmed cases', '4'],
        ['confirmed-deaths-counter', 'Confirmed deaths', '1'],
        ['death-rate-counter', 'Death rate', '25.00%'],
        ['vaccine-doses-counter', 'Vaccine doses', '12,299'],
    ])('when we look at the counter with id "%s"', (
        counterId: string,
        expectedCounterLabel: string,
        expectedCount: string
    ) => {
        let counter: HTMLElement

        beforeEach(() => {
            counter = screen.getByTestId(counterId)
        })

        it(`should have label "${expectedCounterLabel}"`, () => {
            expect(getByText(counter, expectedCounterLabel)).toBeInTheDocument()
        })

        it(`should display the count as "${expectedCount}"`, () => {
            expect(getByText(counter, expectedCount)).toBeInTheDocument()
        })

        it('should display the count duration', () => {
            expect(getByText(counter, '14-Jan-2020 to 21-Jan-2020')).toBeInTheDocument()
        })
    })

    describe('when we look at "Cumulative cases"', () => {
        let cumulativeCases: HTMLElement

        beforeEach(() => {
            cumulativeCases = screen.getByTestId('cumulative-cases')
        })

        it('should show correct label', () => {
            expect(getByText(cumulativeCases, 'Cumulative cases')).toBeInTheDocument()
        })

        describe('when we look inside in it', () => {
            let covid19Table: HTMLElement

            beforeEach(() => {
                covid19Table = getByTestId(cumulativeCases, 'covid19-table')
            })

            it.each([
                ['Countries, areas or territories'],
                ['Cumulative confirms'],
                ['Cumulative deaths'],
                ['Death rate'],
            ])('should have "%s" column', (columnLabel: string) => {
                expect(getAllByText(covid19Table, columnLabel).length).toBeGreaterThan(0)
            })
        })
    })

    describe('when we look at trend panel', () => {
        let trendPanel: HTMLElement

        beforeEach(() => {
            trendPanel = screen.getByTestId('trend-panel')
            expect(trendPanel).toBeInTheDocument()
        })

        it('should be named "Trend (measured by month)"', () => {
            expect(getByText(trendPanel, 'Trend (measured by month)')).toBeInTheDocument()
        })

        it('should have a country selector', () => {
            expect(getByDisplayValue(trendPanel, 'All impacted countries')).toBeInTheDocument()
        })

        it('should have a chart', () => {
            expect(getByTestId(trendPanel, 'covid19-chart')).toBeInTheDocument()
        })
    })

    it('should show the project version', () => {
        expect(screen.getByText(`version: ${packageJson.version}`)).toBeInTheDocument()
    })

    it('should have "refresh" button', () => {
        expect(screen.getByText('Refresh')).toBeInTheDocument()
    })

    it('should have a message to show the last refresh time', () => {
        const offset = Utils.localOffset()
        const dateTimeFormat = 'DD-MMM-YYYY HH:mm:ss'
        const currentTimestampInUtc = Utils.currentUtcTimestampInMilliseconds()
        const lastUpdatedTime = Utils.timestampToStringWithOffset(currentTimestampInUtc, offset, dateTimeFormat)
        const lastUpdatedTimeMessage = `Last refresh time: ${lastUpdatedTime}`
        expect(screen.getByText(lastUpdatedTimeMessage)).toBeInTheDocument()
    })
})

const covid19Data: ExternalCovid19Data = {
    "result": {
        "pageContext": {
            "countryGroups": [
                {
                    "dimension": {
                        "name": "Country",
                        "type": "STRING",
                        "dataType": "STRING"
                    },
                    "value": "US",
                    "data": {
                        "metrics": [
                            {
                                "name": "Deaths",
                                "type": "NUMBER",
                                "dataType": "NUMERIC",
                                "aggregateFunction": "SUM"
                            },
                            {
                                "name": "Cumulative Deaths",
                                "type": "NUMBER",
                                "dataType": "NUMERIC",
                                "aggregateFunction": "SUM"
                            },
                            {
                                "name": "Deaths Last 7 Days",
                                "type": "NUMBER",
                                "dataType": "NUMERIC",
                                "aggregateFunction": "SUM"
                            },
                            {
                                "name": "Deaths Last 7 Days Change",
                                "type": "NUMBER",
                                "dataType": "NUMERIC",
                                "aggregateFunction": "SUM"
                            },
                            {
                                "name": "Deaths Per Million",
                                "type": "NUMBER",
                                "dataType": "NUMERIC",
                                "aggregateFunction": "SUM"
                            },
                            {
                                "name": "Confirmed",
                                "type": "NUMBER",
                                "dataType": "NUMERIC",
                                "aggregateFunction": "SUM"
                            },
                            {
                                "name": "Cumulative Confirmed",
                                "type": "NUMBER",
                                "dataType": "NUMERIC",
                                "aggregateFunction": "SUM"
                            },
                            {
                                "name": "Cases Last 7 Days",
                                "type": "NUMBER",
                                "dataType": "NUMERIC",
                                "aggregateFunction": "SUM"
                            },
                            {
                                "name": "Cases Last 7 Days Change",
                                "type": "NUMBER",
                                "dataType": "NUMERIC",
                                "aggregateFunction": "SUM"
                            },
                            {
                                "name": "Cases Per Million",
                                "type": "NUMBER",
                                "dataType": "NUMERIC",
                                "aggregateFunction": "SUM"
                            }
                        ],
                        "dimensions": [
                            {
                                "name": "day",
                                "type": "TIMESTAMP",
                                "dataType": "STRING"
                            },
                            {
                                "name": "Region",
                                "type": "STRING",
                                "dataType": "STRING"
                            }
                        ],
                        "rows": [
                            [
                                1579478400000,
                                "AMRO",
                                0, // deaths
                                0, // Cumulative Deaths
                                0, // Deaths Last 7 Days
                                0, // Deaths Last 7 Days Change
                                0, // Deaths Per Million
                                1, // Confirmed
                                1, // Cumulative Confirmed
                                0, // Cases Last 7 Days
                                0, // Cases Last 7 Days Change
                                0 // Cases Per Million
                            ],
                            [
                                1579564800000,
                                "AMRO",
                                0, // deaths
                                0, // Cumulative Deaths
                                0, // Deaths Last 7 Days
                                0, // Deaths Last 7 Days Change
                                0, // Deaths Per Million
                                0, // Confirmed
                                1, // Cumulative Confirmed
                                0, // Cases Last 7 Days
                                0, // Cases Last 7 Days Change
                                0 // Cases Per Million
                            ]
                        ]
                    }
                },
                {
                    "dimension": {
                        "name": "Country",
                        "type": "STRING",
                        "dataType": "STRING"
                    },
                    "value": "JP",
                    "data": {
                        "metrics": [
                            {
                                "name": "Deaths",
                                "type": "NUMBER",
                                "dataType": "NUMERIC",
                                "aggregateFunction": "SUM"
                            },
                            {
                                "name": "Cumulative Deaths",
                                "type": "NUMBER",
                                "dataType": "NUMERIC",
                                "aggregateFunction": "SUM"
                            },
                            {
                                "name": "Deaths Last 7 Days",
                                "type": "NUMBER",
                                "dataType": "NUMERIC",
                                "aggregateFunction": "SUM"
                            },
                            {
                                "name": "Deaths Last 7 Days Change",
                                "type": "NUMBER",
                                "dataType": "NUMERIC",
                                "aggregateFunction": "SUM"
                            },
                            {
                                "name": "Deaths Per Million",
                                "type": "NUMBER",
                                "dataType": "NUMERIC",
                                "aggregateFunction": "SUM"
                            },
                            {
                                "name": "Confirmed",
                                "type": "NUMBER",
                                "dataType": "NUMERIC",
                                "aggregateFunction": "SUM"
                            },
                            {
                                "name": "Cumulative Confirmed",
                                "type": "NUMBER",
                                "dataType": "NUMERIC",
                                "aggregateFunction": "SUM"
                            },
                            {
                                "name": "Cases Last 7 Days",
                                "type": "NUMBER",
                                "dataType": "NUMERIC",
                                "aggregateFunction": "SUM"
                            },
                            {
                                "name": "Cases Last 7 Days Change",
                                "type": "NUMBER",
                                "dataType": "NUMERIC",
                                "aggregateFunction": "SUM"
                            },
                            {
                                "name": "Cases Per Million",
                                "type": "NUMBER",
                                "dataType": "NUMERIC",
                                "aggregateFunction": "SUM"
                            }
                        ],
                        "dimensions": [
                            {
                                "name": "day",
                                "type": "TIMESTAMP",
                                "dataType": "STRING"
                            },
                            {
                                "name": "Region",
                                "type": "STRING",
                                "dataType": "STRING"
                            }
                        ],
                        "rows": [
                            [
                                1578960000000,
                                "WPRO",
                                0, // deaths
                                0, // Cumulative Deaths
                                0, // Deaths Last 7 Days
                                0, // Deaths Last 7 Days Change
                                0, // Deaths Per Million
                                1, // Confirmed
                                1, // Cumulative Confirmed
                                0, // Cases Last 7 Days
                                0, // Cases Last 7 Days Change
                                0 // Cases Per Million
                            ],
                            [
                                1579046400000,
                                "WPRO",
                                1, // deaths
                                1, // Cumulative Deaths
                                0, // Deaths Last 7 Days
                                0, // Deaths Last 7 Days Change
                                0, // Deaths Per Million
                                2, // Confirmed
                                3, // Cumulative Confirmed
                                0, // Cases Last 7 Days
                                0, // Cases Last 7 Days Change
                                0 // Cases Per Million
                            ]
                        ]
                    }
                }
            ],
            "rawDataSets": {
                "vaccineData": {
                    "data": [
                        {
                            "REPORT_COUNTRY": "Falkland Islands (Malvinas)",
                            "ISO3": "FLK",
                            "WHO_REGION": "AMRO",
                            "DATE_UPDATED": "2021-04-14",
                            "TOTAL_VACCINATIONS": 4407,
                            "PERSONS_VACCINATED_1PLUS_DOSE": 2632,
                            "PERSONS_FULLY_VACCINATED": 1775,
                            "TOTAL_VACCINATIONS_PER100": 126.529,
                            "PERSONS_VACCINATED_1PLUS_DOSE_PER100": 75.567,
                            "PERSONS_FULLY_VACCINATED_PER100": 50.962
                        },
                        {
                            "REPORT_COUNTRY": "Saint Helena",
                            "ISO3": "SHN",
                            "WHO_REGION": "AFRO",
                            "DATE_UPDATED": "2021-05-05",
                            "TOTAL_VACCINATIONS": 7892,
                            "PERSONS_VACCINATED_1PLUS_DOSE": 4361,
                            "PERSONS_FULLY_VACCINATED": 3531,
                            "TOTAL_VACCINATIONS_PER100": 129.995,
                            "PERSONS_VACCINATED_1PLUS_DOSE_PER100": 71.833,
                            "PERSONS_FULLY_VACCINATED_PER100": 58.162
                        }
                    ]
                }
            }
        }
    }
}
