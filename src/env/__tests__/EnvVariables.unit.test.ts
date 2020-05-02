import EnvVariables from '../EnvVariables'

describe('EnvVariables', () => {
    describe('#refreshCovid19DataIntervalInMilliseconds', () => {
        it('should return the value defined in the .env', () => {
            const intervalInMinutes = process.env.REACT_APP_REFRESH_COVID19_DATA_INTERVAL_IN_MINUTE
            const expectedResult = Number(intervalInMinutes) * 60 * 1000
            expect(EnvVariables.refreshCovid19DataIntervalInMilliseconds).toEqual(expectedResult)
        })
    })
})
