/// <reference types="node" />
import { Readable } from 'stream';
export declare class EntryStream extends Readable {
    constructor();
    _read(): void;
    received(value: any): void;
}
