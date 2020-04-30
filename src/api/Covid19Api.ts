import { Covid19Data } from '../models/internal/covid19-internal-models'

export class Covid19Api {
    static findCovid19Data = async (): Promise<Covid19Data[]> => {
        const response = await fetch('https://dashboards-dev.sprinklr.com/data/9043/global-covid19-who-gis.json')
        const externalCovid19Data = await response.json()
        return externalCovid19Data.rows.map((row: (number | string)[]) => {
            const region = row[2] as string
            const countryCode = row[1] as string
            const timestampInMillisecond = row[0] as number
            const numberOfDeaths = row[3] as number
            const numberOfCumulativeDeaths = row[4] as number
            const numberOfConfirms = row[5] as number
            const numberOfCumulativeConfirms = row[6] as number
            return new Covid19Data(region, countryCode, timestampInMillisecond, numberOfDeaths, numberOfCumulativeDeaths, numberOfConfirms, numberOfCumulativeConfirms)
        })
    }
}
