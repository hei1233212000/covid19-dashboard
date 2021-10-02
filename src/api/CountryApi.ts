import { Country } from '../models/internal/country-internal-models'
import { Country as ExternalCountry } from '../models/external/country-external-models'

export default class CountryApi {
    static COUNTRY_API_ACCESS_KEY = '1ffd2655adbdeab07f7feb34b12c9f87'

    static findCountries = async (): Promise<Country[]> => {
        const response = await fetch('http://api.countrylayer.com/v2/all?access_key=' + CountryApi.COUNTRY_API_ACCESS_KEY)
        const externalCountries = await response.json() as ExternalCountry[]
        return externalCountries.map((externalCountry: ExternalCountry) => {
            return new Country(externalCountry.region, externalCountry.alpha2Code, externalCountry.name, externalCountry.flag)
        })
    }
}
