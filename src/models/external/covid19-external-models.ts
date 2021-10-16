// generated from https://jvilk.com/MakeTypes/

export interface Covid19Data {
    result: Result;
}

export interface Result {
    pageContext: PageContext;
}

export interface PageContext {
    countryGroups: (CountryGroupsEntity)[];
    rawDataSets: RawDataSets;
}

export interface CountryGroupsEntity {
    dimension?: DimensionsEntityOrDimension;
    value: string;
    data: Data;
}

export interface DimensionsEntityOrDimension {
    name: string;
    type: string;
    dataType: string;
}

export interface Data {
    metrics?: (MetricsEntity)[] | null;
    dimensions?: (DimensionsEntityOrDimension)[] | null;
    rows: ((number | string)[])[];
}

export interface MetricsEntity {
    name: string;
    type: string;
    dataType: string;
    aggregateFunction: string;
}

export interface RawDataSets {
    vaccineData: VaccineData;
}

export interface VaccineData {
    data: VaccineDataItem[];
}

export interface VaccineDataItem {
    REPORT_COUNTRY: string;
    ISO3: string;
    WHO_REGION: string;
    DATE_UPDATED: string;
    TOTAL_VACCINATIONS: number | null;
    PERSONS_VACCINATED_1PLUS_DOSE: number | null;
    PERSONS_FULLY_VACCINATED: number | null;
    TOTAL_VACCINATIONS_PER100: number | null;
    PERSONS_VACCINATED_1PLUS_DOSE_PER100: number | null;
    PERSONS_FULLY_VACCINATED_PER100: number | null;
}
