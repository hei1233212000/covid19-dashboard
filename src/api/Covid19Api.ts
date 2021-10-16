import { Covid19Data, Covid19FullData, Covid19VaccineData } from '../models/internal/covid19-internal-models'
import { Covid19Data as ExternalCovid19Data } from '../models/external/covid19-external-models'

export class Covid19Api {
    static readonly timestampInMillisecondIndex = 0;
    static readonly regionIndex = 1;
    static readonly numberOfDeathsIndex = 2;
    static readonly numberOfCumulativeDeathsIndex = 3;
    static readonly numberOfConfirmsIndex = 7;
    static readonly numberOfCumulativeConfirmsIndex = 8;

    static findCovid19Data = async (): Promise<Covid19FullData> => {
        const response = await fetch('https://data.covid-19.drunkard-pig.com/covid19-data.gzip')
        const externalCovid19Data = await response.json() as ExternalCovid19Data
        const covid19Data = externalCovid19Data.result.pageContext.countryGroups
            .flatMap(countryGroup => {
                const countryCode = countryGroup.value
                return countryGroup.data.rows.map(row => {
                    const region = row[Covid19Api.regionIndex] as string
                    const timestampInMillisecond = row[Covid19Api.timestampInMillisecondIndex] as number
                    const numberOfDeaths = row[Covid19Api.numberOfDeathsIndex] as number
                    const numberOfCumulativeDeaths = row[Covid19Api.numberOfCumulativeDeathsIndex] as number
                    const numberOfConfirms = row[Covid19Api.numberOfConfirmsIndex] as number
                    const numberOfCumulativeConfirms = row[Covid19Api.numberOfCumulativeConfirmsIndex] as number
                    return new Covid19Data(region, countryCode, timestampInMillisecond, numberOfDeaths, numberOfCumulativeDeaths, numberOfConfirms, numberOfCumulativeConfirms)
                })
            })
        const covid19VaccineData = externalCovid19Data.result.pageContext.rawDataSets.vaccineData.data.map(data => {
            const region = data.WHO_REGION
            const countryCode = data.ISO3
            const totalVaccinations = data.TOTAL_VACCINATIONS || 0
            const personsVaccinatedOnePlusDose = data.PERSONS_VACCINATED_1PLUS_DOSE || 0
            const personsFullyVaccinated = data.PERSONS_FULLY_VACCINATED || 0
            const totalVaccinationsPerHundred = data.TOTAL_VACCINATIONS_PER100 || 0
            const personsVaccinatedOnePlusDosePerHundred = data.PERSONS_VACCINATED_1PLUS_DOSE_PER100 || 0
            const personsFullyVaccinatedPerHundred = data.PERSONS_FULLY_VACCINATED_PER100 || 0
            return new Covid19VaccineData(region, countryCode, totalVaccinations, personsVaccinatedOnePlusDose,
                personsFullyVaccinated, totalVaccinationsPerHundred, personsVaccinatedOnePlusDosePerHundred,
                personsFullyVaccinatedPerHundred)
        })
        return new Covid19FullData(covid19Data, covid19VaccineData)
    }
}
