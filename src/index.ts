import { Iterator, Level } from 'level';
import { EntryStream } from './streams/entry';

export class Storage {
  db: Level;
  splitter: string;
  schemes: any;
  constructor(location: string, options?: any) {
    const opts = options || {};
    this.db = new Level(location);
    this.splitter = opts.splitter || ':';
    this.schemes = opts.schemes || {};
  }

  async get(type: string, id: string): Promise<any> {
    try {
      const entryValue = await this.db.get(Storage.key(type, id, this.splitter));
      return JSON.parse(entryValue);
    } catch (e) {
      return null;
    }
  }

  async batchGet(keys: string[]) {
    const values = await this.db.getMany(keys);
    return values;
  }

  async batch(operations: any) {
    this.db.batch(operations);
  }
  static key(type: string, id: string, splitter: string = ':') {
    return `${type}${splitter}${id}`;
  }

  async save(type: string, id: string, value: any): Promise<any> {
    const key = Storage.key(type, id, this.splitter);
    const existing = await this.get(type, id);
    if (existing) {
      return await this.db.put(
        key,
        JSON.stringify({
          ...existing,
          _value: {
            ...(existing._value || {}),
            ...value,
          },
          _type: type,
          _version: existing._version + 1,
          _updatedAt: Date.now(),
          _id: id,
        }),
      );
    }
    return await this.db.put(
      key,
      JSON.stringify({
        _value: value,
        _type: type,
        _version: 1,
        _created: Date.now(),
        _id: id,
        _updatedAt: Date.now(),
      }),
    );
  }

  list(keyStart: string, keyEnd: string = keyStart): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const values: any[] = [];
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

  async load(keyArray: string[]) {
    const results = await this.batchGet(keyArray);

    return results.filter((x) => !!x);
  }

  static async consumeIterator(iterator: any, stream: EntryStream): Promise<any> {
    for await (const [key, value] of iterator) {
      stream.received(value);
    }
    stream.received(null);
  }

  stream(keyStart: string, keyEnd: string = keyStart): EntryStream {
    const stream = new EntryStream();
    const iterator = this.db.iterator({
      gte: `${keyStart}`,
      lte: `${keyEnd}${String.fromCharCode(keyEnd.charCodeAt(0) + 1)}`,
    });

    Storage.consumeIterator(iterator, stream).then();
    return stream;
  }
}
