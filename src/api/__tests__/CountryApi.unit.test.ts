import { Country as ExternalCountry } from '../../models/external/country-external-models'
import CountryApi from '../CountryApi'
import { Country } from '../../models/internal/country-internal-models'
import externalCountries from '../../data/countries.json'

describe('CountryApi', () => {
    describe('#findCountries', () => {
        it('should return country list', async () => {
            const countries = await CountryApi.findCountries()
            expect(countries.length).toBeGreaterThan(0)

            countries.forEach((country: Country, index: number) => {
                const externalCountry = externalCountries[index] as ExternalCountry
                expect(country.region).toEqual(externalCountry.region)
                expect(country.countryCode).toEqual(externalCountry.alpha2Code)
                expect(country.name).toEqual(externalCountry.name)
                expect(country.flagUrl).toEqual(externalCountry.flag)
            })
        })
    })
})
