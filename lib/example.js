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
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const storage = new _1.Storage('test-db-1');
(() => __awaiter(void 0, void 0, void 0, function* () {
    const id = 'test-key-1';
    const type = 'test-type-1';
    const value = { test: 'value' };
    yield storage.save(type, id, value);
    const result = yield storage.get(type, id);
    // eslint-disable-next-line no-console
    console.log(result);
}))();
