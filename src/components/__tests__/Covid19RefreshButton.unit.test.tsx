import React from 'react'
import { act } from 'react-dom/test-utils'
import { cleanup, render, screen } from '@testing-library/react'
import Covid19RefreshButton from '../Covid19RefreshButton'
import { RefreshCovid19DataFunction } from '../../context/Covid19DashboardContext'

describe('Covid19RefreshButton', () => {
    let mockedRefreshCovid19DataFunction: RefreshCovid19DataFunction
    let capturedManualRefresh: boolean | undefined = undefined
    let refreshButton: HTMLElement
    const expectedLabel = 'Refresh'

    beforeEach(async () => {
        mockedRefreshCovid19DataFunction = jest.fn((manualRefresh?: boolean) => {
            capturedManualRefresh = manualRefresh
        })
        await act(async () => {
            render(<Covid19RefreshButton refreshCovid19DataFunction={mockedRefreshCovid19DataFunction}/>)
        })
        refreshButton = screen.getByText(expectedLabel)
    })

    afterEach(cleanup)

    it(`should have label "${expectedLabel}"`, () => {
        expect(refreshButton).toBeInTheDocument()
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
