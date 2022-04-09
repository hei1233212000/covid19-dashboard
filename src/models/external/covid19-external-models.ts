export interface Covid19Data {
    covid19Data: Covid19DataItem,
    vaccinationData: Covid19DataItem
}

export interface Covid19DataItem {
    headers: string[],
    data: any[][]
}
