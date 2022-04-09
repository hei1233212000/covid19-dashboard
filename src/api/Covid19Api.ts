import { Covid19Data, Covid19FullData, Covid19VaccineData } from '../models/internal/covid19-internal-models'
import { Covid19Data as ExternalCovid19Data } from '../models/external/covid19-external-models'

export class Covid19Api {
    static findCovid19Data = async (): Promise<Covid19FullData> => {
        const response = await fetch('https://data.covid-19.drunkard-pig.com/covid19-data.gzip')
        const externalCovid19Data = await response.json() as ExternalCovid19Data
        const covid19Data = Covid19Api.__extractCovid19Data(externalCovid19Data)
        const covid19VaccineData = Covid19Api.__extractCovid19VaccineData(externalCovid19Data)
        return new Covid19FullData(covid19Data, covid19VaccineData)
    }

    static __extractCovid19Data = (externalCovid19Data: ExternalCovid19Data): Covid19Data[] => {
        const headers = externalCovid19Data.covid19Data.headers;
        const countryCodeIndex = headers.indexOf('countryCode')
        const timestampInMillisecondIndex = headers.indexOf('timestampInMs')
        const regionIndex = headers.indexOf('region')
        const numberOfDeathsIndex = headers.indexOf('newDeaths')
        const numberOfCumulativeDeathsIndex = headers.indexOf('cumulativeDeaths')
        const numberOfConfirmsIndex = headers.indexOf('newCases')
        const numberOfCumulativeConfirmsIndex = headers.indexOf('cumulativeCases')

        return externalCovid19Data.covid19Data.data
            .flatMap(row => {
                const countryCode = row[countryCodeIndex] as string
                const region = row[regionIndex] as string
                const timestampInMillisecond = row[timestampInMillisecondIndex] as number
                const numberOfDeaths = row[numberOfDeathsIndex] as number
                const numberOfCumulativeDeaths = row[numberOfCumulativeDeathsIndex] as number
                const numberOfConfirms = row[numberOfConfirmsIndex] as number
                const numberOfCumulativeConfirms = row[numberOfCumulativeConfirmsIndex] as number
                return new Covid19Data(region, countryCode, timestampInMillisecond, numberOfDeaths, numberOfCumulativeDeaths, numberOfConfirms, numberOfCumulativeConfirms)
            })
    }

    static __extractCovid19VaccineData = (externalCovid19Data: ExternalCovid19Data): Covid19VaccineData[] => {
        const headers = externalCovid19Data.vaccinationData.headers;
        const regionIndex = headers.indexOf('region')
        const countryCodeIndex = headers.indexOf('countryCode')
        const totalVaccinationsIndex = headers.indexOf('totalVaccinations')
        const personsVaccinatedOnePlusDoseIndex = headers.indexOf('personsVaccinatedOnePlusDose')
        const personsFullyVaccinatedIndex = headers.indexOf('personsFullyVaccinated')
        const totalVaccinationsPerHundredIndex = headers.indexOf('totalVaccinationsPerHundred')
        const personsVaccinatedOnePlusDosePerHundredIndex = headers.indexOf('personsVaccinatedOnePlusDosePerHundred')
        const personsFullyVaccinatedPerHundredIndex = headers.indexOf('personsFullyVaccinatedPerHundred')

        return externalCovid19Data.vaccinationData.data.map(row => {
            const region = row[regionIndex]
            const countryCode = row[countryCodeIndex]
            const totalVaccinations = row[totalVaccinationsIndex] || 0
            const personsVaccinatedOnePlusDose = row[personsVaccinatedOnePlusDoseIndex] || 0
            const personsFullyVaccinated = row[personsFullyVaccinatedIndex] || 0
            const totalVaccinationsPerHundred = row[totalVaccinationsPerHundredIndex] || 0
            const personsVaccinatedOnePlusDosePerHundred = row[personsVaccinatedOnePlusDosePerHundredIndex] || 0
            const personsFullyVaccinatedPerHundred = row[personsFullyVaccinatedPerHundredIndex] || 0
            return new Covid19VaccineData(region, countryCode, totalVaccinations, personsVaccinatedOnePlusDose,
                personsFullyVaccinated, totalVaccinationsPerHundred, personsVaccinatedOnePlusDosePerHundred,
                personsFullyVaccinatedPerHundred)
        })
    }
}
