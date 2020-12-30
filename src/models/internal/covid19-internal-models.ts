export class Covid19Data {
    readonly region: string
    readonly countryCode: string
    readonly timestampInMillisecond: number
    readonly numberOfDeaths: number
    readonly numberOfCumulativeDeaths: number
    readonly numberOfConfirms: number
    readonly numberOfCumulativeConfirms: number
    readonly deathRate: number

    constructor(region: string, countryCode: string, timestampInMillisecond: number, numberOfDeaths: number, numberOfCumulativeDeaths: number, numberOfConfirms: number, numberOfCumulativeConfirms: number) {
        this.region = region
        this.countryCode = countryCode
        this.timestampInMillisecond = timestampInMillisecond
        this.numberOfDeaths = numberOfDeaths
        this.numberOfCumulativeDeaths = numberOfCumulativeDeaths
        this.numberOfConfirms = numberOfConfirms
        this.numberOfCumulativeConfirms = numberOfCumulativeConfirms
        this.deathRate = 0
        if (this.numberOfCumulativeConfirms) {
            this.deathRate = this.numberOfCumulativeDeaths / this.numberOfCumulativeConfirms
        }
    }
}
