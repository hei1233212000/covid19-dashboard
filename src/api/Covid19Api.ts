import { Covid19Data } from '../models/internal/covid19-internal-models'
import { Covid19Data as ExternalCovid19Data } from '../models/external/covid19-external-models'

export class Covid19Api {
    static readonly timestampInMillisecondIndex = 0;
    static readonly regionIndex = 1;
    static readonly numberOfDeathsIndex = 2;
    static readonly numberOfCumulativeDeathsIndex = 3;
    static readonly numberOfConfirmsIndex = 7;
    static readonly numberOfCumulativeConfirmsIndex = 8;

    static findCovid19Data = async (): Promise<Covid19Data[]> => {
        const response = await fetch('https://data.covid-19.drunkard-pig.com/covid19-data.gzip')
        const externalCovid19Data = await response.json() as ExternalCovid19Data
        return externalCovid19Data.result.pageContext.countryGroups
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
    }
}
