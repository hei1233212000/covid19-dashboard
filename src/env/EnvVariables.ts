import Utils from '../utils/Utils'

export default class EnvVariables {
    static readonly refreshCovid19DataIntervalInMilliseconds: number = EnvVariables.findRefreshCovid19DataIntervalInMilliseconds()

    private static findRefreshCovid19DataIntervalInMilliseconds(): number {
        const intervalInMinutes = process.env.REACT_APP_REFRESH_COVID19_DATA_INTERVAL_IN_MINUTE
        if (intervalInMinutes && Utils.isNumber(intervalInMinutes)) {
            console.log(`the refresh COVID-19 data interval is set to "${intervalInMinutes}" minutes`)
            return Utils.minuteToMilliseconds(parseInt(intervalInMinutes))
        } else {
            throw Error(`REACT_APP_REFRESH_COVID19_DATA_INTERVAL_IN_MINUTE[${intervalInMinutes}] is NOT defined as a number`)
        }
    }
}
