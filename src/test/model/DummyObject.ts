export const createDummyObject = (key: string, value: number) => new DummyObject(key, value)

export class DummyObject {
    readonly key: string
    readonly value: number

    constructor(key: string, value: number) {
        this.key = key
        this.value = value
    }
}
