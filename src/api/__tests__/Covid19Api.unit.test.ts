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
                    ],
                    "rawDataSets": {
                        "vaccineData": {
                            "data": [
                                {
                                    "REPORT_COUNTRY": "Falkland Islands (Malvinas)",
                                    "ISO3": "FLK",
                                    "WHO_REGION": "AMRO",
                                    "DATE_UPDATED": "2021-04-14",
                                    "TOTAL_VACCINATIONS": 4407,
                                    "PERSONS_VACCINATED_1PLUS_DOSE": 2632,
                                    "PERSONS_FULLY_VACCINATED": 1775,
                                    "TOTAL_VACCINATIONS_PER100": 126.529,
                                    "PERSONS_VACCINATED_1PLUS_DOSE_PER100": 75.567,
                                    "PERSONS_FULLY_VACCINATED_PER100": 50.962
                                },
                                {
                                    "REPORT_COUNTRY": "Saint Helena",
                                    "ISO3": "SHN",
                                    "WHO_REGION": "AFRO",
                                    "DATE_UPDATED": "2021-05-05",
                                    "TOTAL_VACCINATIONS": 7892,
                                    "PERSONS_VACCINATED_1PLUS_DOSE": 4361,
                                    "PERSONS_FULLY_VACCINATED": 3531,
                                    "TOTAL_VACCINATIONS_PER100": 129.995,
                                    "PERSONS_VACCINATED_1PLUS_DOSE_PER100": 71.833,
                                    "PERSONS_FULLY_VACCINATED_PER100": 58.162
                                }
                            ]
                        }
                    }
                }
            }
        }

        let covid19FullData: Covid19FullData

        beforeEach(async () => {
            fetchMock.mockOnce(JSON.stringify(externalCovid19DataList))
            covid19FullData = await Covid19Api.findCovid19Data()
        })

        it('should return COVID-19 data list', async () => {
            const covid19DataList = covid19FullData.covid19Data
            const expectedTotalNumberOfRecords = externalCovid19DataList.result.pageContext.countryGroups
                .map(group => group.data.rows.length)
                .reduce((a, b) => a + b);
            expect(covid19DataList).toHaveLength(expectedTotalNumberOfRecords)

            covid19DataList.forEach((covid19Data: Covid19Data, index: number) => {
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

        it('should return COVID-19 vaccine data list', () => {
            const covid19VaccineDataList = covid19FullData.covid19VaccineData;
            const expectedTotalNumberOfRecords = externalCovid19DataList.result.pageContext.rawDataSets.vaccineData.data.length;
            expect(covid19VaccineDataList).toHaveLength(expectedTotalNumberOfRecords)

            covid19VaccineDataList.forEach((covid19VaccineData: Covid19VaccineData, index: number) => {
                const vaccineDataItem = externalCovid19DataList.result.pageContext.rawDataSets.vaccineData.data[index];
                expect(covid19VaccineData.region).toEqual(vaccineDataItem.WHO_REGION)
                expect(covid19VaccineData.countryCode).toEqual(vaccineDataItem.ISO3)
                expect(covid19VaccineData.totalVaccinations).toEqual(vaccineDataItem.TOTAL_VACCINATIONS)
                expect(covid19VaccineData.personsVaccinatedOnePlusDose).toEqual(vaccineDataItem.PERSONS_VACCINATED_1PLUS_DOSE)
                expect(covid19VaccineData.personsFullyVaccinated).toEqual(vaccineDataItem.PERSONS_FULLY_VACCINATED)
                expect(covid19VaccineData.totalVaccinationsPerHundred).toEqual(vaccineDataItem.TOTAL_VACCINATIONS_PER100)
                expect(covid19VaccineData.personsVaccinatedOnePlusDosePerHundred).toEqual(vaccineDataItem.PERSONS_VACCINATED_1PLUS_DOSE_PER100)
                expect(covid19VaccineData.personsFullyVaccinatedPerHundred).toEqual(vaccineDataItem.PERSONS_FULLY_VACCINATED_PER100)
            })
        })
    })
})
