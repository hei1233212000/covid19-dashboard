import React from 'react'
import { render, screen } from '@testing-library/react'
import Covid19RefreshButton from '../Covid19RefreshButton'
import { RefreshCovid19DataFunction } from '../../context/Covid19DashboardContext'
import Utils from '../../utils/Utils'

describe('Covid19RefreshButton', () => {
    let mockedRefreshCovid19DataFunction: RefreshCovid19DataFunction
    const lastUpdatedTimeInMilliseconds = 1579046412345
    let capturedManualRefresh: boolean | undefined = undefined
    let refreshButton: HTMLElement
    const refreshIconText = 'Refresh'

    beforeEach(async () => {
        mockedRefreshCovid19DataFunction = jest.fn((manualRefresh?: boolean) => {
            capturedManualRefresh = manualRefresh
        })
        render(<Covid19RefreshButton
            refreshCovid19DataFunction={mockedRefreshCovid19DataFunction}
            lastUpdatedTimeInMilliseconds={lastUpdatedTimeInMilliseconds}
        />)
        refreshButton = await screen.findByText(refreshIconText)
    })

    it(`should have text "${refreshIconText}"`, () => {
        expect(refreshButton).toBeInTheDocument()
    })

    it('should have message to show the last refresh time', () => {
        const offset = Utils.localOffset()
        const dateTimeFormat = 'DD-MMM-YYYY HH:mm:ss'
        const lastUpdatedTime = Utils.timestampToStringWithOffset(lastUpdatedTimeInMilliseconds, offset, dateTimeFormat)
        const lastUpdatedTimeMessage = `Last refresh time: ${lastUpdatedTime}`
        expect(screen.getByText(lastUpdatedTimeMessage)).toBeInTheDocument()
    })

    describe('when we click it', () => {
        beforeEach(() => {
            refreshButton.click()
        })

        it('should trigger the refreshCovid19DataFunction', () => {
            expect(mockedRefreshCovid19DataFunction).toHaveBeenCalled()
        })

        it('should refresh the covid19Data manually', () => {
            expect(capturedManualRefresh).toEqual(true)
        })
    })
})
