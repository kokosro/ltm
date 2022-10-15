"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
const level_1 = require("level");
const entry_1 = require("./streams/entry");
class Storage {
    constructor(location, options) {
        const opts = options || {};
        this.db = new level_1.Level(location);
        this.splitter = opts.splitter || ':';
        this.schemes = opts.schemes || {};
    }
    get(type, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entryValue = yield this.db.get(Storage.key(type, id, this.splitter));
                return JSON.parse(entryValue);
            }
            catch (e) {
                return null;
            }
        });
    }
    batchGet(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            const values = yield this.db.getMany(keys);
            return values;
        });
    }
    batch(operations) {
        return __awaiter(this, void 0, void 0, function* () {
            this.db.batch(operations);
        });
    }
    static key(type, id, splitter = ':') {
        return `${type}${splitter}${id}`;
    }
    save(type, id, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = Storage.key(type, id, this.splitter);
            const existing = yield this.get(type, id);
            if (existing) {
                return yield this.db.put(key, JSON.stringify(Object.assign(Object.assign({}, existing), { _value: Object.assign(Object.assign({}, (existing._value || {})), value), _type: type, _version: existing._version + 1, _updatedAt: Date.now(), _id: id })));
            }
            return yield this.db.put(key, JSON.stringify({
                _value: value,
                _type: type,
                _version: 1,
                _created: Date.now(),
                _id: id,
                _updatedAt: Date.now(),
            }));
        });
    }
    list(keyStart, keyEnd = keyStart) {
        return new Promise((resolve, reject) => {
            const values = [];
            const stream = this.stream(keyStart, keyEnd);
            stream.on('data', (data) => {
                values.push(data);
            });
            stream.on('end', () => {
                resolve(values);
            });
            stream.on('error', (err) => {
                reject(err);
            });
        });
    }
    load(keyArray) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.batchGet(keyArray);
            return results.filter((x) => !!x);
        });
    }
    static consumeIterator(iterator, stream) {
        var iterator_1, iterator_1_1;
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (iterator_1 = __asyncValues(iterator); iterator_1_1 = yield iterator_1.next(), !iterator_1_1.done;) {
                    const [key, value] = iterator_1_1.value;
                    stream.received(value);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (iterator_1_1 && !iterator_1_1.done && (_a = iterator_1.return)) yield _a.call(iterator_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    stream(keyStart, keyEnd = keyStart) {
        const stream = new entry_1.EntryStream();
        const iterator = this.db.iterator({
            gte: `${keyStart}`,
            lte: `${keyEnd}${String.fromCharCode(keyEnd.charCodeAt(0) + 1)}`,
        });
        Storage.consumeIterator(iterator, stream).then();
        return stream;
    }
}
exports.Storage = Storage;
