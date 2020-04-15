import CountryApi from '../../api/CountryApi'
import { Country } from '../../models/internal/country-internal-models'

describe('CountryApi integration test', () => {
    describe('#findCountries', () => {
        it('should return country list', done => {
            CountryApi.findCountries().then((countries: Country[]) => {
                expect(countries).toBeDefined()
                expect(countries.length).toBeGreaterThan(0)

                countries.forEach((country: Country) => {
                    expect(country.region).toBeDefined()
                    expect(country.countryCode).toBeDefined()
                    expect(country.name).toBeDefined()
                    expect(country.flagUrl).toBeDefined()
                })
                done()
            })
        })
    })
})
