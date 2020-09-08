// generated from https://jvilk.com/MakeTypes/

export interface Covid19Data {
    result: Result;
}

export interface Result {
    pageContext: PageContext;
}

export interface PageContext {
    countryGroups: (CountryGroupsEntity)[];
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
