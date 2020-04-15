// generated from https://jvilk.com/MakeTypes/

export interface Country {
    name: string
    topLevelDomain?: (string)[] | null
    alpha2Code: string
    alpha3Code: string
    callingCodes?: (string)[] | null
    capital: string
    altSpellings?: (string | null)[] | null
    region: string
    subregion: string
    population: number
    latlng?: (number | null)[] | null
    demonym: string
    area?: number | null
    gini?: number | null
    timezones?: (string)[] | null
    borders?: (string | null)[] | null
    nativeName: string
    numericCode?: string | null
    currencies?: (CurrenciesEntity)[] | null
    languages?: (LanguagesEntity)[] | null
    translations: Translations
    flag: string
    regionalBlocs?: (RegionalBlocsEntity | null)[] | null
    cioc?: string | null
}
export interface CurrenciesEntity {
    code?: string | null
    name?: string | null
    symbol?: string | null
}
export interface LanguagesEntity {
    iso639_1?: string | null
    iso639_2: string
    name: string
    nativeName: string
}
export interface Translations {
    de?: string | null
    es?: string | null
    fr?: string | null
    ja?: string | null
    it?: string | null
    br: string
    pt: string
    nl?: string | null
    hr?: string | null
    fa: string
}
export interface RegionalBlocsEntity {
    acronym: string
    name: string
    otherAcronyms?: (string | null)[] | null
    otherNames?: (string | null)[] | null
}
