"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntryStream = void 0;
const stream_1 = require("stream");
class EntryStream extends stream_1.Readable {
    constructor() {
        super({ objectMode: true });
    }
    _read() {
        // ...
    }
    received(value) {
        if (typeof value === 'string') {
            this.push(JSON.parse(value));
        }
        else {
            this.push(value);
        }
    }
}
exports.EntryStream = EntryStream;
