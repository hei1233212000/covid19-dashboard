import { Country } from '../models/internal/country-internal-models'
import { Country as ExternalCountry } from '../models/external/country-external-models'
import counties from '../data/countries.json'

export default class CountryApi {
    static findCountries = async (): Promise<Country[]> => {
        const externalCountries = counties as ExternalCountry[]
        return externalCountries.map((externalCountry: ExternalCountry) => {
            return new Country(externalCountry.region, externalCountry.alpha2Code, externalCountry.name, externalCountry.flag)
        })
    }
}
