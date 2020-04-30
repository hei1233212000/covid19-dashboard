import { enableFetchMocks } from 'jest-fetch-mock'
import { Country as ExternalCountry } from '../../models/external/country-external-models'
import CountryApi from '../CountryApi'
import { Country } from '../../models/internal/country-internal-models'

enableFetchMocks()

describe('CountryApi', () => {
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    describe('#findCountries', () => {
        const externalCountries: ExternalCountry[] = [
            {region: "region-1", alpha2Code: "country-code-1", name: "name-1", flag: "flag-url-1"} as ExternalCountry,
            {region: "region-2", alpha2Code: "country-code-2", name: "name-2", flag: "flag-url-2"} as ExternalCountry,
        ]

        beforeEach(() => {
            fetchMock.mockOnce(JSON.stringify(externalCountries))
        })

        it('should return country list', async () => {
            const countries = await CountryApi.findCountries()
            expect(countries).toHaveLength(externalCountries.length)

            countries.forEach((country: Country, index: number) => {
                const externalCountry = externalCountries[index]
                expect(country.region).toEqual(externalCountry.region)
                expect(country.countryCode).toEqual(externalCountry.alpha2Code)
                expect(country.name).toEqual(externalCountry.name)
                expect(country.flagUrl).toEqual(externalCountry.flag)
            })
        })
    })
})
