import { Level } from 'level';
import { EntryStream } from './streams/entry';
export declare class Storage {
    db: Level;
    splitter: string;
    schemes: any;
    constructor(location: string, options?: any);
    get(type: string, id: string): Promise<any>;
    batchGet(keys: string[]): Promise<string[]>;
    batch(operations: any): Promise<void>;
    static key(type: string, id: string, splitter?: string): string;
    save(type: string, id: string, value: any): Promise<any>;
    list(keyStart: string, keyEnd?: string): Promise<any[]>;
    load(keyArray: string[]): Promise<string[]>;
    static consumeIterator(iterator: any, stream: EntryStream): Promise<any>;
    stream(keyStart: string, keyEnd?: string): EntryStream;
}
