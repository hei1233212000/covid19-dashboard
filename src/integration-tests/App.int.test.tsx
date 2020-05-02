import React from 'react'
import { cleanup, getByText, render, screen, getByTestId } from '@testing-library/react'
import { waitFor } from '@testing-library/dom'
import App from '../App'
import { act } from 'react-dom/test-utils'
import { Country as ExternalCountry } from '../models/external/country-external-models'
import { Covid19Data as ExternalCovid19Data } from '../models/external/covid19-external-models'
import { enableFetchMocks } from 'jest-fetch-mock'
import 'jest-canvas-mock'
import packageJson from '../../package.json'
import Utils from '../utils/Utils';

enableFetchMocks()

describe('App integration test', () => {
    beforeEach(async () => {
        fetchMock.resetMocks()

        fetchMock.mockIf(/.*/, (request: Request) => {
            if (request.url.includes('countries')) {
                return Promise.resolve(JSON.stringify(countries))
            } else if (request.url.includes('covid')) {
                return Promise.resolve(JSON.stringify(covid19Data))
            } else {
                return Promise.resolve('Error')
            }
        })

        Utils.currentUtcTimestampInMilliseconds = jest.fn().mockReturnValue(1579478400000)

        await act(async () => {
            render(<App/>)
        })

        await waitFor(
            () => expect(fetchMock).toHaveBeenCalledTimes(2)
        )
    })

    afterEach(cleanup)

    it('should have Header', () => {
        expect(screen.getByText('COVID-19 outbreak situation')).toBeInTheDocument()
    })

    it('should have Footer', () => {
        expect(screen.getByText('Powered by React and PrimeReact')).toBeInTheDocument()
    })

    describe.each([
        ['confirmed-cases-counter', 'Confirmed cases', '4'],
        ['confirmed-deaths-counter', 'Confirmed deaths', '1'],
        ['countries-areas-territories-counter', 'Countries, areas or territories with cases', '2'],
    ])('when we look at the counter with id "%s"', (
        counterId: string,
        expectedCounterLabel: string,
        expectedCount: string
    ) => {
        let counter: HTMLElement

        beforeEach(() => {
            counter = screen.getByTestId(counterId)
        })

        it(`should have label "${expectedCounterLabel}"`, () => {
            expect(getByText(counter, expectedCounterLabel)).toBeInTheDocument()
        })

        it(`should display the count as "${expectedCount}"`, () => {
            expect(getByText(counter, expectedCount)).toBeInTheDocument()
        })

        it('should display the count duration', () => {
            expect(getByText(counter, '14-Jan-2020 to 21-Jan-2020')).toBeInTheDocument()
        })
    })

    describe('when we look at "Cumulative cases"', () => {
        let cumulativeCases: HTMLElement

        beforeEach(() => {
            cumulativeCases = screen.getByTestId('cumulative-cases')
        })

        it('should show correct label', () => {
            expect(getByText(cumulativeCases, 'Cumulative cases')).toBeInTheDocument()
        })

        describe('when we look inside in it', () => {
            let covid19Table: HTMLElement

            beforeEach(() => {
                covid19Table = getByTestId(cumulativeCases, 'covid19-table')
            })

            it.each([
                ['Country'],
                ['Cumulative Confirms'],
                ['Cumulative Deaths'],
            ])('should have "%s" column', (columnLabel: string) => {
                expect(getByText(covid19Table, columnLabel)).toBeInTheDocument()
            })
        })
    })

    it('should have "Trend" chart', () => {
        expect(screen.getByText('Trend')).toBeInTheDocument()
    })

    it('should show the project version', () => {
        expect(screen.getByText(`version: ${packageJson.version}`)).toBeInTheDocument()
    })

    it('should have "refresh" button', () => {
        expect(screen.getByText('Refresh')).toBeInTheDocument()
    })

    it('should have a message to show the last updatd time', () => {
        const offset = Utils.localOffset()
        const dateTimeFormat = 'DD-MMM-YYYY HH:mm:ss'
        const currentTimestampInUtc = Utils.currentUtcTimestampInMilliseconds()
        const lastUpdatedTime = Utils.timestampToStringWithOffset(currentTimestampInUtc, offset, dateTimeFormat)
        const lastUpdatedTimeMessage = `Last updated time: ${lastUpdatedTime}`
        expect(screen.getByText(lastUpdatedTimeMessage)).toBeInTheDocument()
    })
})

const countries: ExternalCountry[] = [
    {
        "name": "United States of America",
        "topLevelDomain": [
            ".us"
        ],
        "alpha2Code": "US",
        "alpha3Code": "USA",
        "callingCodes": [
            "1"
        ],
        "capital": "Washington, D.C.",
        "altSpellings": [
            "US",
            "USA",
            "United States of America"
        ],
        "region": "Americas",
        "subregion": "Northern America",
        "population": 323947000,
        "latlng": [
            38,
            -97
        ],
        "demonym": "American",
        "area": 9629091,
        "gini": 48,
        "timezones": [
            "UTC-12:00",
            "UTC-11:00",
            "UTC-10:00",
            "UTC-09:00",
            "UTC-08:00",
            "UTC-07:00",
            "UTC-06:00",
            "UTC-05:00",
            "UTC-04:00",
            "UTC+10:00",
            "UTC+12:00"
        ],
        "borders": [
            "CAN",
            "MEX"
        ],
        "nativeName": "United States",
        "numericCode": "840",
        "currencies": [
            {
                "code": "USD",
                "name": "United States dollar",
                "symbol": "$"
            }
        ],
        "languages": [
            {
                "iso639_1": "en",
                "iso639_2": "eng",
                "name": "English",
                "nativeName": "English"
            }
        ],
        "translations": {
            "de": "Vereinigte Staaten von Amerika",
            "es": "Estados Unidos",
            "fr": "États-Unis",
            "ja": "アメリカ合衆国",
            "it": "Stati Uniti D'America",
            "br": "Estados Unidos",
            "pt": "Estados Unidos",
            "nl": "Verenigde Staten",
            "hr": "Sjedinjene Američke Države",
            "fa": "ایالات متحده آمریکا"
        },
        "flag": "https://restcountries.eu/data/usa.svg",
        "regionalBlocs": [
            {
                "acronym": "NAFTA",
                "name": "North American Free Trade Agreement",
                "otherAcronyms": [],
                "otherNames": [
                    "Tratado de Libre Comercio de América del Norte",
                    "Accord de Libre-échange Nord-Américain"
                ]
            }
        ],
        "cioc": "USA"
    },
    {
        "name": "Japan",
        "topLevelDomain": [
            ".jp"
        ],
        "alpha2Code": "JP",
        "alpha3Code": "JPN",
        "callingCodes": [
            "81"
        ],
        "capital": "Tokyo",
        "altSpellings": [
            "JP",
            "Nippon",
            "Nihon"
        ],
        "region": "Asia",
        "subregion": "Eastern Asia",
        "population": 126960000,
        "latlng": [
            36,
            138
        ],
        "demonym": "Japanese",
        "area": 377930,
        "gini": 38.1,
        "timezones": [
            "UTC+09:00"
        ],
        "borders": [],
        "nativeName": "日本",
        "numericCode": "392",
        "currencies": [
            {
                "code": "JPY",
                "name": "Japanese yen",
                "symbol": "¥"
            }
        ],
        "languages": [
            {
                "iso639_1": "ja",
                "iso639_2": "jpn",
                "name": "Japanese",
                "nativeName": "日本語 (にほんご)"
            }
        ],
        "translations": {
            "de": "Japan",
            "es": "Japón",
            "fr": "Japon",
            "ja": "日本",
            "it": "Giappone",
            "br": "Japão",
            "pt": "Japão",
            "nl": "Japan",
            "hr": "Japan",
            "fa": "ژاپن"
        },
        "flag": "https://restcountries.eu/data/jpn.svg",
        "regionalBlocs": [],
        "cioc": "JPN"
    }
]

const covid19Data: ExternalCovid19Data = {
    "dimensions": [
        {
            "name": "day",
            "type": "TIMESTAMP",
            "dataType": null
        },
        {
            "name": "Country",
            "type": "STRING",
            "dataType": null
        },
        {
            "name": "Region",
            "type": "STRING",
            "dataType": null
        }
    ],
    "metrics": [
        {
            "name": "Deaths",
            "type": "NUMBER",
            "dataType": null
        },
        {
            "name": "Cumulative Deaths",
            "type": "NUMBER",
            "dataType": null
        },
        {
            "name": "Confirmed",
            "type": "NUMBER",
            "dataType": null
        },
        {
            "name": "Cumulative Confirmed",
            "type": "NUMBER",
            "dataType": null
        }
    ],
    "rows": [
        [
            1579478400000,
            "US",
            "AMRO",
            0,
            0,
            1,
            1
        ],
        [
            1579564800000,
            "US",
            "AMRO",
            0,
            0,
            0,
            1
        ],
        [
            1578960000000,
            "JP",
            "WPRO",
            0,
            0,
            1,
            1
        ],
        [
            1579046400000,
            "JP",
            "WPRO",
            1,
            1,
            2,
            3
        ]
    ]
}
