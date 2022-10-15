import { Storage } from '.';

const storage = new Storage('test-db-1');

(async () => {
  const id = 'test-key-1';
  const type = 'test-type-1';
  const value = { test: 'value' };
  await storage.save(type, id, value);
  const result = await storage.get(type, id);
  // eslint-disable-next-line no-console
  console.log(result);
})();
