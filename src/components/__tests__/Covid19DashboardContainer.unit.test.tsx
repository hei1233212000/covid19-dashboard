import React from 'react'
import Covid19DashboardContainer from '../Covid19DashboardContainer'
import { render, screen, waitFor } from '@testing-library/react'
import { Country } from '../../models/internal/country-internal-models'
import { Covid19Data } from '../../models/internal/covid19-internal-models'
import CountryApi from '../../api/CountryApi'
import { Covid19Api } from '../../api/Covid19Api'
import 'jest-canvas-mock'
import EnvVariables from '../../env/EnvVariables'

jest.mock('../../api/CountryApi')
jest.mock('../../api/Covid19Api')

describe('Covid19DashboardContainer', () => {
    const emptyCountries: Country[] = []
    const nonEmptyCountries: Country[] = [
        new Country('Americas', 'US', 'USA', 'https://restcountries.eu/data/usa.svg')
    ]

    const emptyCovid19Data: Covid19Data[] = []
    const nonEmptyCovid19Data: Covid19Data[] = [
        new Covid19Data('AMRO', 'US', 1582502400000, 0, 0, 0, 0)
    ]

    beforeEach(() => {
        jest.useFakeTimers()
    })

    describe.each([
        [emptyCountries, emptyCovid19Data, true],
        [emptyCountries, nonEmptyCovid19Data, true],
        [nonEmptyCountries, emptyCovid19Data, true],
        [nonEmptyCountries, nonEmptyCovid19Data, false],
    ])('when countries is %o and covid19Data is %o', (countries: Country[], covid19Data: Covid19Data[], shouldShowLoadingSpinner: boolean) => {
        beforeEach(async () => {
            CountryApi.findCountries = jest.fn().mockReturnValue(Promise.resolve(countries))
            Covid19Api.findCovid19Data = jest.fn().mockReturnValue(Promise.resolve(covid19Data))

            render(<Covid19DashboardContainer/>)
            await waitFor(
                () => expect(setInterval).toHaveBeenCalledTimes(shouldShowLoadingSpinner ? 0 : 1)
            )
        })

        if (shouldShowLoadingSpinner) {
            it('should show loading spinner', () => {
                expect(screen.getByRole('alert')).toBeInTheDocument()
            })
        } else {
            it('should NOT show loading spinner', () => {
                expect(screen.queryByRole('alert')).toBeNull()
            })
        }
    })

    describe('when the component is rendered', () => {
        let expectedRefreshCovid19DataIntervalInMilliseconds: number
        let rerenderComponent: Function

        beforeEach(async () => {
            expectedRefreshCovid19DataIntervalInMilliseconds = EnvVariables.refreshCovid19DataIntervalInMilliseconds

            CountryApi.findCountries = jest.fn().mockReturnValue(Promise.resolve(nonEmptyCountries))
            Covid19Api.findCovid19Data = jest.fn().mockReturnValue(Promise.resolve(nonEmptyCovid19Data))

            const {rerender} = render(<Covid19DashboardContainer/>)
            rerenderComponent = rerender
            await waitFor(
                () => expect(setInterval).toHaveBeenCalledTimes(1)
            )
        })

        it('should start the scheduler to auto refresh the COVID-19 data', () => {
            expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), expectedRefreshCovid19DataIntervalInMilliseconds)
        })

        it('should NOT trigger the scheduler cleanup in the first render', () => {
            expect(clearInterval).toHaveBeenCalledTimes(0)
        })

        describe('when we rerender the component', () => {
            beforeEach(() => {
                jest.clearAllMocks()
                // make sure the call count is reset
                expect(setInterval).toHaveBeenCalledTimes(0)
                rerenderComponent(<Covid19DashboardContainer/>)
            })

            it('should clean the scheduler', async () => {
                await waitFor(
                    () => expect(clearInterval).toHaveBeenCalledTimes(1)
                )
            })

            it('should restart the scheduler', async () => {
                await waitFor(
                    () => expect(setInterval).toHaveBeenCalledTimes(1)
                )
            })
        })
    })
})
