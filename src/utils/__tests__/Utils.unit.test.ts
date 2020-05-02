import Utils from '../Utils'
import { createDummyObject, DummyObject } from '../../test/model/DummyObject'

describe('Utils', () => {
    describe('#isEmpty and #isNotEmpty', () => {
        describe.each([
            /* return true */
            ['', true],
            [[], true],
            [true, true],
            [false, true],
            [-1, true],
            [0, true],
            [1, true],
            [{}, true],
            /* return false */
            [['any item'], false],
            [{key: 'any value'}, false],
        ])('when the input is "%s"', (input: string | boolean | number | object, expectedIsEmptyOutput: boolean) => {
            it(`#isEmpty should return "${expectedIsEmptyOutput}"`, () => {
                expect(Utils.isEmpty(input)).toEqual(expectedIsEmptyOutput)
            })

            it(`#isNotEmpty should return "${!expectedIsEmptyOutput}"`, () => {
                expect(Utils.isNotEmpty(input)).toEqual(!expectedIsEmptyOutput)
            })
        })
    })

    describe('#timestampToStringWithOffset', () => {
        it('should able to convert timestamp to string by specific offset', () => {
            // Tuesday, April 14, 2020 12:00:00 AM GMT
            const timestampInMillisecond = 1586822400000
            const dateFormat = 'DD-MMM-YYYY HH:mm:ss'
            const offset = 480
            const result = Utils.timestampToStringWithOffset(timestampInMillisecond, offset, dateFormat)
            expect(result).toEqual('14-Apr-2020 08:00:00')
        })
    })

    describe('#localOffset', () => {
        it('should return local offset', () => {
            const expectedResult = new Date().getTimezoneOffset() * -1
            expect(Utils.localOffset()).toEqual(expectedResult)
        })
    })

    describe('#groupBy', () => {
        const listOfObjects = [
            createDummyObject('key-1', 11),
            createDummyObject('key-1', 12),
            createDummyObject('key-2', 21),
        ]

        it('should create a map by grouping a specific from a list of object', () => {
            const map = Utils.groupBy(listOfObjects, (dummyObject: DummyObject) => dummyObject.key)
            let key1List = map.get('key-1')!
            expect(key1List).toBeInstanceOf(Array)
            expect(key1List).toMatchObject([listOfObjects[0], listOfObjects[1]])

            let key2List = map.get('key-2')!
            expect(key2List).toBeInstanceOf(Array)
            expect(key2List).toEqual([listOfObjects[2]])

            expect(map.get('no-exit')).toBeUndefined()
        })
    })

    describe('#formatNumber', () => {
        describe.each([
            [0, '0'],
            [10, '10'],
            [100, '100'],
            [1000, '1,000'],
            [1000000, '1,000,000'],
        ])('input: "%s"', (anyNumber: number, expectedResult: string) => {
            it(`should return "${expectedResult}"`, () => {
                expect(Utils.formatNumberWithCommas(anyNumber)).toEqual(expectedResult)
            })
        })
    })

    describe('#isNumber', () => {
        describe.each([
            ['a', false],
            ['-1', true],
            ['0', true],
            ['1', true],
            ['0.11', true],
        ])('input: "%s"', (input: string, expectedResult: boolean) => {
            it(`should return "${expectedResult}"`, () => {
                expect(Utils.isNumber(input)).toEqual(expectedResult)
            })
        })
    })

    describe('#minuteToMilliseconds', () => {
        describe.each([
            [0, 0],
            [1, 60000],
            [60, 3600000],
        ])('input: "%d"', (minutes: number, expectedMilliseconds: number) => {
            it(`should return "${expectedMilliseconds}"`, () => {
                expect(Utils.minuteToMilliseconds(minutes)).toEqual(expectedMilliseconds)
            })
        })
    })
})
