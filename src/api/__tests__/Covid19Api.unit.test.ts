import { enableFetchMocks } from 'jest-fetch-mock'
import { Covid19Data as ExternalCovid19Data } from '../../models/external/covid19-external-models'
import { Covid19Data, Covid19FullData, Covid19VaccineData } from '../../models/internal/covid19-internal-models'
import { Covid19Api } from '../Covid19Api'

enableFetchMocks()

describe('Covid19Api', () => {
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    describe('#findCovid19Data', () => {
        const externalCovid19DataList: ExternalCovid19Data = {
            covid19Data: {
                headers: ['region', 'countryCode', 'timestampInMs', 'newDeaths', 'cumulativeDeaths', 'newCases', 'cumulativeCases'],
                data: [
                    [
                        'EMRO',
                        'AF',
                        1582502400000,
                        0, // deaths
                        0, // Cumulative Deaths
                        1, // Confirmed
                        1  // Cumulative Confirmed
                    ],
                    [
                        'EMRO',
                        'AF',
                        1585267200000,
                        0, // deaths
                        2, // Cumulative Deaths
                        0, // Confirmed
                        80 // Cumulative Confirmed
                    ]
                ]
            },
            vaccinationData: {
                headers: ['region','countryCode','totalVaccinations','personsVaccinatedOnePlusDose','personsFullyVaccinated','totalVaccinationsPerHundred','personsVaccinatedOnePlusDosePerHundred','personsFullyVaccinatedPerHundred'],
                data: [
                    [
                        'AMRO',
                        'FLK',
                        4407,    // totalVaccinations
                        2632,    // personsVaccinatedOnePlusDose
                        1775,    // personsFullyVaccinated
                        126.529, // totalVaccinationsPerHundred
                        75.567,  // personsVaccinatedOnePlusDosePerHundred
                        50.962   // personsFullyVaccinatedPerHundred
                    ],
                    [
                        'AFRO',
                        'SHN',
                        7892,    // totalVaccinations
                        4361,    // personsVaccinatedOnePlusDose
                        3531,    // personsFullyVaccinated
                        129.995, // totalVaccinationsPerHundred
                        71.833,  // personsVaccinatedOnePlusDosePerHundred
                        58.162   // personsFullyVaccinatedPerHundred
                    ]
                ]
            }
        }

        let covid19FullData: Covid19FullData

        beforeEach(async () => {
            fetchMock.mockOnce(JSON.stringify(externalCovid19DataList))
            covid19FullData = await Covid19Api.findCovid19Data()
        })

        it('should return COVID-19 data list', async () => {
            const covid19DataList = covid19FullData.covid19Data
            const expectedTotalNumberOfRecords = externalCovid19DataList.covid19Data.data.length;
            expect(covid19DataList).toHaveLength(expectedTotalNumberOfRecords)

            covid19DataList.forEach((covid19Data: Covid19Data, index: number) => {
                const externalCovid19Data = externalCovid19DataList.covid19Data.data[index]
                expect(covid19Data.region).toEqual(externalCovid19Data[0])
                expect(covid19Data.countryCode).toEqual(externalCovid19Data[1])
                expect(covid19Data.timestampInMillisecond).toEqual(externalCovid19Data[2])
                expect(covid19Data.numberOfDeaths).toEqual(externalCovid19Data[3])
                expect(covid19Data.numberOfCumulativeDeaths).toEqual(externalCovid19Data[4])
                expect(covid19Data.numberOfConfirms).toEqual(externalCovid19Data[5])
                expect(covid19Data.numberOfCumulativeConfirms).toEqual(externalCovid19Data[6])
            })
        })

        it('should return COVID-19 vaccine data list', () => {
            const covid19VaccineDataList = covid19FullData.covid19VaccineData;
            const expectedTotalNumberOfRecords = externalCovid19DataList.vaccinationData.data.length
            expect(covid19VaccineDataList).toHaveLength(expectedTotalNumberOfRecords)

            covid19VaccineDataList.forEach((covid19VaccineData: Covid19VaccineData, index: number) => {
                const vaccineDataItem = externalCovid19DataList.vaccinationData.data[index];
                expect(covid19VaccineData.region).toEqual(vaccineDataItem[0])
                expect(covid19VaccineData.countryCode).toEqual(vaccineDataItem[1])
                expect(covid19VaccineData.totalVaccinations).toEqual(vaccineDataItem[2])
                expect(covid19VaccineData.personsVaccinatedOnePlusDose).toEqual(vaccineDataItem[3])
                expect(covid19VaccineData.personsFullyVaccinated).toEqual(vaccineDataItem[4])
                expect(covid19VaccineData.totalVaccinationsPerHundred).toEqual(vaccineDataItem[5])
                expect(covid19VaccineData.personsVaccinatedOnePlusDosePerHundred).toEqual(vaccineDataItem[6])
                expect(covid19VaccineData.personsFullyVaccinatedPerHundred).toEqual(vaccineDataItem[7])
            })
        })
    })
})
