import { Covid19Api } from '../../api/Covid19Api'
import { Covid19Data, Covid19FullData, Covid19VaccineData } from '../../models/internal/covid19-internal-models'

describe('Covid19Api integration test', () => {
    describe('#findCovid19Data', () => {
        let covid19FullData: Covid19FullData

        beforeAll(async () => {
            covid19FullData = await Covid19Api.findCovid19Data()
        }, 30000)

        it('should return COVID-19 data list', () => {
            const covid19DataList = covid19FullData.covid19Data
            expect(covid19DataList).toBeDefined()
            expect(covid19DataList.length).toBeGreaterThan(0)

            covid19DataList.forEach((covid19Data: Covid19Data) => {
                expect(covid19Data.region).toBeDefined()
                expect(covid19Data.countryCode).toBeDefined()
                expect(covid19Data.timestampInMillisecond).toBeDefined()
                expect(covid19Data.numberOfDeaths).toBeDefined()
                expect(covid19Data.numberOfCumulativeDeaths).toBeDefined()
                expect(covid19Data.numberOfConfirms).toBeDefined()
                expect(covid19Data.numberOfCumulativeConfirms).toBeDefined()
                expect(covid19Data.deathRate).toBeDefined()
            })
        })

        it('should return COVID-19 vaccine data list', () => {
            const covid19VaccineDataList = covid19FullData.covid19VaccineData;
            expect(covid19VaccineDataList).toBeDefined()
            expect(covid19VaccineDataList.length).toBeGreaterThan(0)

            covid19VaccineDataList.forEach((covid19VaccineData: Covid19VaccineData) => {
                expect(covid19VaccineData.region).toBeDefined()
                expect(covid19VaccineData.countryCode).toBeDefined()
                expect(covid19VaccineData.totalVaccinations).toBeGreaterThanOrEqual(0)
                expect(covid19VaccineData.personsVaccinatedOnePlusDose).toBeGreaterThanOrEqual(0)
                expect(covid19VaccineData.personsFullyVaccinated).toBeGreaterThanOrEqual(0)
                expect(covid19VaccineData.totalVaccinationsPerHundred).toBeGreaterThanOrEqual(0)
                expect(covid19VaccineData.personsVaccinatedOnePlusDosePerHundred).toBeGreaterThanOrEqual(0)
                expect(covid19VaccineData.personsFullyVaccinatedPerHundred).toBeGreaterThanOrEqual(0)
            })
        })
    })
})
