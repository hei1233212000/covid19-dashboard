import { enableFetchMocks } from 'jest-fetch-mock'
import { Covid19Data as ExternalCovid19Data } from '../../models/external/covid19-external-models'
import { Covid19Data } from '../../models/internal/covid19-internal-models'
import { Covid19Api } from '../Covid19Api'

enableFetchMocks()

describe('Covid19Api', () => {
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    describe('#findCovid19Data', () => {
        const externalCovid19DataList = {
            "result": {
                "pageContext": {
                    "countryGroups": [
                        {
                            "value": "AF",
                            "data": {
                                "rows": [
                                    [
                                        1582502400000,
                                        "EMRO",
                                        0, // deaths
                                        0, // Cumulative Deaths
                                        0, // Deaths Last 7 Days
                                        0, // Deaths Last 7 Days Change
                                        0, // Deaths Per Million
                                        1, // Confirmed
                                        1, // Cumulative Confirmed
                                        0, // Cases Last 7 Days
                                        0, // Cases Last 7 Days Change
                                        0 // Cases Per Million
                                    ]
                                ]
                            }
                        },
                        {
                            "value": "AF",
                            "data": {
                                "rows": [
                                    [
                                        1585267200000,
                                        "EMRO",
                                        0, // deaths
                                        2, // Cumulative Deaths
                                        0, // Deaths Last 7 Days
                                        0, // Deaths Last 7 Days Change
                                        0, // Deaths Per Million
                                        0, // Confirmed
                                        80, // Cumulative Confirmed
                                        0, // Cases Last 7 Days
                                        0, // Cases Last 7 Days Change
                                        0 // Cases Per Million
                                    ]
                                ]
                            }
                        }
                    ]
                }
            }
        } as ExternalCovid19Data

        beforeEach(() => {
            fetchMock.mockOnce(JSON.stringify(externalCovid19DataList))
        })

        it('should return COVID-19 data list', async () => {
            const covid19FullData = await Covid19Api.findCovid19Data()
            const covid19Data = covid19FullData.covid19Data
            const expectedTotalNumberOfRecords = externalCovid19DataList.result.pageContext.countryGroups
                .map(group => group.data.rows.length)
                .reduce((a, b) => a + b);
            expect(covid19Data).toHaveLength(expectedTotalNumberOfRecords)

            covid19Data.forEach((covid19Data: Covid19Data, index: number) => {
                const externalCovid19DataCountryGroup = externalCovid19DataList.result.pageContext.countryGroups[index]
                const externalCovid19Data = externalCovid19DataCountryGroup.data.rows[0]
                expect(covid19Data.region).toEqual(externalCovid19Data[1])
                expect(covid19Data.countryCode).toEqual(externalCovid19DataCountryGroup.value)
                expect(covid19Data.timestampInMillisecond).toEqual(externalCovid19Data[0])
                expect(covid19Data.numberOfDeaths).toEqual(externalCovid19Data[2])
                expect(covid19Data.numberOfCumulativeDeaths).toEqual(externalCovid19Data[3])
                expect(covid19Data.numberOfConfirms).toEqual(externalCovid19Data[7])
                expect(covid19Data.numberOfCumulativeConfirms).toEqual(externalCovid19Data[8])
            })
        })
    })
})
