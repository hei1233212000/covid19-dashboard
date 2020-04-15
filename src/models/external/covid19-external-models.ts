// generated from https://jvilk.com/MakeTypes/

export interface Covid19Data {
    dimensions: (DimensionsEntityOrMetricsEntity)[]
    metrics: (DimensionsEntityOrMetricsEntity)[]
    rows: ((number | string)[])[]
}

export interface DimensionsEntityOrMetricsEntity {
    name: string
    type: string
    dataType?: null
}
