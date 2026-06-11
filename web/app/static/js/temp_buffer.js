export class TempBuffer {
    constructor() {
        this.buffer = new Map();
    }
    add(key, value) {
        this.buffer[key] = value
    }
    get(key) {
        if (this.buffer.hasOwnProperty(key)) {
            return this.buffer[key]
        }
        return null

    }
    delete(key) {
        if (this.buffer.hasOwnProperty(key)) {
            delete this.buffer[key]
        }


    }
}