import { Country } from '../models/internal/country-internal-models'
import { Country as ExternalCountry } from '../models/external/country-external-models'

export default class CountryApi {
    static findCountries = async (): Promise<Country[]> => {
        const response = await fetch('https://restcountries.eu/rest/v2/all')
        const externalCountries = await response.json() as ExternalCountry[]
        return externalCountries.map((externalCountry: ExternalCountry) => {
            return new Country(externalCountry.region, externalCountry.alpha2Code, externalCountry.name, externalCountry.flag)
        })
    }
}
