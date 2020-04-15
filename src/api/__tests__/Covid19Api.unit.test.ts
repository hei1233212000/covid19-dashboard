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
            rows: [
                [
                    1582502400000,
                    "AF",
                    "EMRO",
                    0,
                    0,
                    1,
                    1
                ],
                [
                    1585267200000,
                    "AF",
                    "EMRO",
                    0,
                    2,
                    0,
                    80
                ]
            ]
        } as ExternalCovid19Data

        beforeEach(() => {
            fetchMock.mockOnce(JSON.stringify(externalCovid19DataList))
        })

        it('should return COVID-19 data list', done => {
            Covid19Api.findCovid19Data().then((covid19DataList: Covid19Data[]) => {
                expect(covid19DataList).toHaveLength(externalCovid19DataList.rows.length)

                covid19DataList.forEach((covid19Data: Covid19Data, index: number) => {
                    const externalCovid19Data = externalCovid19DataList.rows[index]
                    expect(covid19Data.region).toEqual(externalCovid19Data[2])
                    expect(covid19Data.countryCode).toEqual(externalCovid19Data[1])
                    expect(covid19Data.timestampInMillisecond).toEqual(externalCovid19Data[0])
                    expect(covid19Data.numberOfDeaths).toEqual(externalCovid19Data[3])
                    expect(covid19Data.numberOfCumulativeDeaths).toEqual(externalCovid19Data[4])
                    expect(covid19Data.numberOfConfirms).toEqual(externalCovid19Data[5])
                    expect(covid19Data.numberOfCumulativeConfirms).toEqual(externalCovid19Data[6])
                })
                done()
            })
        })
    })
})
