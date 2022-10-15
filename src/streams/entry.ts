import { Readable } from 'stream';

export class EntryStream extends Readable {
  constructor() {
    super({ objectMode: true });
  }

  _read() {
    // ...
  }
  received(value: any) {
    if (typeof value === 'string') {
      this.push(JSON.parse(value));
    } else {
      this.push(value);
    }
  }
}
