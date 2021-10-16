import { Covid19DashboardState } from '../Covid19DashboardContext'
import { Country } from '../../models/internal/country-internal-models'
import { Covid19Data, Covid19FullData, Covid19VaccineData } from '../../models/internal/covid19-internal-models'

describe('Covid19DashboardState', () => {
    const nonEmptyCountries: Country[] = [
        new Country('Asia', 'AF', 'Afghanistan', 'https://restcountries.eu/data/afg.svg'),
        new Country('Americas', 'US', 'USA', 'https://restcountries.eu/data/usa.svg'),
    ]
    const nonEmptyCovid19Data: Covid19Data[] = [
        new Covid19Data('AMRO', 'US', 1582502400000, 1, 1, 1, 1),
        new Covid19Data('AMRO', 'US', 1582588800000, 1, 2, 2, 3),
        new Covid19Data('AMRO', 'US', 1582675200000, 1, 3, 3, 6),
        new Covid19Data('EMRO', 'AF', 1587502400000, 2, 2, 10, 10),
    ]
    const nonEmptyCovid19VaccineData: Covid19VaccineData[] = [
        new Covid19VaccineData('AMRO', 'US', 10, 0, 0, 0, 0, 0),
        new Covid19VaccineData('EMRO', 'AF', 20, 0, 0, 0, 0, 0),
    ]
    const dummyRefreshCovid19DataFunction: () => void = () => {}
    const fakeLastUpdatedTimestamp = 1
    let state: Covid19DashboardState

    describe('when countries and covid19FullData are provided', () => {
        beforeEach(() => {
            state = new Covid19DashboardState(nonEmptyCountries, new Covid19FullData(nonEmptyCovid19Data, nonEmptyCovid19VaccineData), dummyRefreshCovid19DataFunction, fakeLastUpdatedTimestamp)
        })

        it('should contain countries', () => {
            expect(state.countries).toEqual(nonEmptyCountries)
        })

        it('should contain covid19Data', () => {
            expect(state.covid19Data).toEqual(nonEmptyCovid19Data)
        })

        it('should extract latestCovid19Data', () => {
            const latestCovid19Data: Covid19Data[] = [
                nonEmptyCovid19Data[nonEmptyCovid19Data.length - 2],
                nonEmptyCovid19Data[nonEmptyCovid19Data.length - 1],
            ]
            expect(state.latestCovid19Data).toEqual(latestCovid19Data)
        })

        it('should extract earliestRecordTimestamp', () => {
            expect(state.earliestRecordTimestamp).toEqual(1582502400000)
        })

        it('should extract latestRecordTimestamp', () => {
            expect(state.latestRecordTimestamp).toEqual(1587502400000)
        })

        it('should extract totalCumulativeConfirms', () => {
            expect(state.totalCumulativeConfirms).toEqual(16)
        })

        it('should extract totalCumulativeDeaths', () => {
            expect(state.totalCumulativeDeaths).toEqual(5)
        })

        it('should extract numberOfCountriesWithCases', () => {
            expect(state.totalVaccineDoses).toEqual(30)
        })

        it('should be ready', () => {
            expect(state.ready).toEqual(true)
        })

        it('should contain refreshCovid19FullDataFunction', () => {
            expect(state.refreshCovid19FullDataFunction).toEqual(dummyRefreshCovid19DataFunction)
        })

        it('should contain fakeLastUpdatedTimestamp', () => {
            expect(state.lastUpdatedTimestamp).toEqual(fakeLastUpdatedTimestamp)
        })
    })

    describe.each([
        [[], []],
        [[], nonEmptyCovid19Data],
        [nonEmptyCountries, []],
    ])('when countries is %o and covid19Data is %o', (countries: Country[], covid19Data: Covid19Data[]) => {
        beforeEach(() => {
            state = new Covid19DashboardState(countries, new Covid19FullData(covid19Data, []), dummyRefreshCovid19DataFunction, fakeLastUpdatedTimestamp)
        })

        it('should NOT be ready', () => {
            expect(state.ready).toEqual(false)
        })
    })
})
