import React from 'react'
import Covid19DashboardContainer from '../Covid19DashboardContainer'
import { render, screen } from '@testing-library/react'
import { Country } from '../../models/internal/country-internal-models'
import { Covid19Data } from '../../models/internal/covid19-internal-models'
import CountryApi from '../../api/CountryApi'
import { Covid19Api } from '../../api/Covid19Api'
import { act } from 'react-dom/test-utils'
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

    describe.each([
        [emptyCountries, emptyCovid19Data, true],
        [emptyCountries, nonEmptyCovid19Data, true],
        [nonEmptyCountries, emptyCovid19Data, true],
        [nonEmptyCountries, nonEmptyCovid19Data, false],
    ])('when countries is %o and covid19Data is %o', (countries: Country[], covid19Data: Covid19Data[], shouldShowLoadingSpinner: boolean) => {
        beforeEach(async () => {
            CountryApi.findCountries = jest.fn().mockReturnValue(Promise.resolve(countries))
            Covid19Api.findCovid19Data = jest.fn().mockReturnValue(Promise.resolve(covid19Data))

            await act(async () => {
                render(<Covid19DashboardContainer/>)
            })
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
            jest.useFakeTimers()
            expectedRefreshCovid19DataIntervalInMilliseconds = EnvVariables.refreshCovid19DataIntervalInMilliseconds

            CountryApi.findCountries = jest.fn().mockReturnValue(Promise.resolve(nonEmptyCountries))
            Covid19Api.findCovid19Data = jest.fn().mockReturnValue(Promise.resolve(nonEmptyCovid19Data))

            await act(async () => {
                const {rerender} = render(<Covid19DashboardContainer/>)
                rerenderComponent = rerender
            })
        })

        it('should start the scheduler to auto refresh the COVID-19 data', () => {
            expect(setInterval).toHaveBeenCalledTimes(1)
            expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), expectedRefreshCovid19DataIntervalInMilliseconds)
        })

        it('should NOT trigger the scheduler cleanup in the first render', () => {
            expect(clearInterval).toHaveBeenCalledTimes(0)
        })

        describe('when we rerender the component', () => {
            beforeEach(() => {
                jest.clearAllMocks()
                rerenderComponent(<Covid19DashboardContainer/>)
            })

            it('should clean the scheduler', () => {
                expect(clearInterval).toHaveBeenCalledTimes(1)
            })

            it('should restart the scheduler', () => {
                expect(setInterval).toHaveBeenCalledTimes(1)
            })
        })
    })
})
