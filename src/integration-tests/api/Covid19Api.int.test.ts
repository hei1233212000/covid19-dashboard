import { Covid19Api } from '../../api/Covid19Api'
import { Covid19Data } from '../../models/internal/covid19-internal-models'

describe('Covid19Api integration test', () => {
    describe('#findCovid19Data', () => {
        it('should return COVID-19 data list', async () => {
            const covid19DataList = await Covid19Api.findCovid19Data()
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
        }, 30000)
    })
})
