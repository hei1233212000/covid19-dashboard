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
    covid19Data: {
        headers: ['region', 'countryCode', 'timestampInMs', 'newDeaths', 'cumulativeDeaths', 'newCases', 'cumulativeCases'],
        data: [
            [
                'AMRO',
                'US',
                1579478400000,
                0, // deaths
                0, // Cumulative Deaths
                1, // Confirmed
                1  // Cumulative Confirmed
            ],
            [
                'AMRO',
                'US',
                1579564800000,
                0, // deaths
                0, // Cumulative Deaths
                0, // Confirmed
                1  // Cumulative Confirmed
            ],
            [
                'WPRO',
                'JP',
                1578960000000,
                0, // deaths
                0, // Cumulative Deaths
                1, // Confirmed
                1  // Cumulative Confirmed
            ],
            [
                'WPRO',
                'JP',
                1579046400000,
                1, // deaths
                1, // Cumulative Deaths
                2, // Confirmed
                3  // Cumulative Confirmed
            ]
        ]
    },
    vaccinationData: {
        headers: ['region','countryCode','totalVaccinations','personsVaccinatedOnePlusDose','personsFullyVaccinated','totalVaccinationsPerHundred','personsVaccinatedOnePlusDosePerHundred','personsFullyVaccinatedPerHundred'],
        data: [
            [
                'AMRO',
                'FLK',
                4407,    // totalVaccinations
                2632,    // personsVaccinatedOnePlusDose
                1775,    // personsFullyVaccinated
                126.529, // totalVaccinationsPerHundred
                75.567,  // personsVaccinatedOnePlusDosePerHundred
                50.962   // personsFullyVaccinatedPerHundred
            ],
            [
                'AFRO',
                'SHN',
                7892,    // totalVaccinations
                4361,    // personsVaccinatedOnePlusDose
                3531,    // personsFullyVaccinated
                129.995, // totalVaccinationsPerHundred
                71.833,  // personsVaccinatedOnePlusDosePerHundred
                58.162   // personsFullyVaccinatedPerHundred
            ]
        ]
    }
}
