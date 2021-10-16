export class Covid19FullData {
    readonly covid19Data: Covid19Data[]
    readonly covid19VaccineData: Covid19VaccineData[]

    constructor(covid19Data: Covid19Data[], covid19VaccineData: Covid19VaccineData[]) {
        this.covid19Data = covid19Data
        this.covid19VaccineData = covid19VaccineData
    }
}

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

export class Covid19VaccineData {
    readonly region: string
    readonly countryCode: string
    readonly totalVaccinations: number
    readonly personsVaccinatedOnePlusDose: number
    readonly personsFullyVaccinated: number
    readonly totalVaccinationsPerHundred: number
    readonly personsVaccinatedOnePlusDosePerHundred: number
    readonly personsFullyVaccinatedPerHundred: number

    constructor(
        region: string, countryCode: string, totalVaccinations: number, personsVaccinatedOnePlusDose: number,
        personsFullyVaccinated: number, totalVaccinationsPerHundred: number,
        personsVaccinatedOnePlusDosePerHundred: number, personsFullyVaccinatedPerHundred: number
    ) {
        this.region = region
        this.countryCode = countryCode
        this.totalVaccinations = totalVaccinations
        this.personsVaccinatedOnePlusDose = personsVaccinatedOnePlusDose
        this.personsFullyVaccinated = personsFullyVaccinated
        this.totalVaccinationsPerHundred = totalVaccinationsPerHundred
        this.personsVaccinatedOnePlusDosePerHundred = personsVaccinatedOnePlusDosePerHundred
        this.personsFullyVaccinatedPerHundred = personsFullyVaccinatedPerHundred
    }
}
