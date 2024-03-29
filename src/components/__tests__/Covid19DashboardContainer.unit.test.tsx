import React from 'react'
import Covid19DashboardContainer from '../Covid19DashboardContainer'
import { render, screen } from '@testing-library/react'
import { Country } from '../../models/internal/country-internal-models'
import { Covid19Data, Covid19FullData, Covid19VaccineData } from '../../models/internal/covid19-internal-models'
import CountryApi from '../../api/CountryApi'
import { Covid19Api } from '../../api/Covid19Api'
import 'jest-canvas-mock'
import EnvVariables from '../../env/EnvVariables'
import { waitFor } from '@testing-library/dom';

jest.mock('../../api/CountryApi')
jest.mock('../../api/Covid19Api')

const covid19DashboardTestId = 'covid19-dashboard';
const expectedRefreshCovid19DataIntervalInMilliseconds = EnvVariables.refreshCovid19DataIntervalInMilliseconds
const waitUntilDashboardIsReady = async () => await screen.findByTestId(covid19DashboardTestId)

describe('Covid19DashboardContainer', () => {
    const emptyCountries: Country[] = []
    const nonEmptyCountries: Country[] = [
        new Country('Americas', 'US', 'USA', 'https://restcountries.eu/data/usa.svg')
    ]

    const emptyCovid19Data: Covid19Data[] = []
    const emptyCovid19VaccineData: Covid19VaccineData[] = []
    const nonEmptyCovid19Data: Covid19Data[] = [
        new Covid19Data('AMRO', 'US', 1582502400000, 0, 0, 0, 0)
    ]

    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    describe.each([
        [emptyCountries, emptyCovid19Data],
        [emptyCountries, nonEmptyCovid19Data],
        [nonEmptyCountries, emptyCovid19Data]
    ])('when countries is %o and covid19Data is %o', (countries: Country[], covid19Data: Covid19Data[]) => {
        beforeEach(async () => {
            CountryApi.findCountries = jest.fn().mockReturnValue(Promise.resolve(countries))
            Covid19Api.findCovid19Data = jest.fn().mockReturnValue(Promise.resolve(new Covid19FullData(covid19Data, emptyCovid19VaccineData)))

            render(<Covid19DashboardContainer/>)
            await waitFor(() => {
                expect(CountryApi.findCountries).toHaveBeenCalledTimes(1)
                expect(Covid19Api.findCovid19Data).toHaveBeenCalledTimes(1)
            })
        })

        it('should show loading spinner', () => {
            expect(screen.getByRole('alert')).toBeInTheDocument()
        })
    })

    describe('when the component is already rendered', () => {
        let rerenderComponent: Function
        let unmountFunction: Function

        beforeEach(async () => {
            CountryApi.findCountries = jest.fn().mockReturnValue(Promise.resolve(nonEmptyCountries))
            Covid19Api.findCovid19Data = jest.fn().mockReturnValue(Promise.resolve(new Covid19FullData(nonEmptyCovid19Data, emptyCovid19VaccineData)))

            const {rerender, unmount} = render(<Covid19DashboardContainer/>)
            rerenderComponent = rerender
            unmountFunction = unmount
            await waitUntilDashboardIsReady()
            jest.advanceTimersByTime(expectedRefreshCovid19DataIntervalInMilliseconds)
        })

        afterEach(() => {
            // we unmount the component to prevent "Warning: An update to Covid19DashboardContainer inside a test was not wrapped in act(...)."
            unmountFunction()
        })

        it('should NOT show loading spinner', () => {
            expect(screen.queryByRole('alert')).not.toBeInTheDocument()
        })

        // FIXME: find a way to make this test working again
        xit('should start the scheduler to auto refresh the COVID-19 data', () => {
            expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), expectedRefreshCovid19DataIntervalInMilliseconds)
        })

        it('should NOT trigger the scheduler cleanup in the first render', () => {
            expect(clearInterval).not.toBeCalled()
        })

        describe('when we rerender the component', () => {
            beforeEach(() => {
                jest.clearAllMocks()
                // make sure the call count is reset
                expect(setInterval).toHaveBeenCalledTimes(0)
                expect(clearInterval).toHaveBeenCalledTimes(0)
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
