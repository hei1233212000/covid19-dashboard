export class Country {
    readonly region: string
    readonly countryCode: string
    readonly name: string
    readonly flagUrl: string

    constructor(region: string, countryCode: string, name: string, flagUrl: string) {
        this.region = region
        this.countryCode = countryCode
        this.name = name
        this.flagUrl = flagUrl
    }
}
