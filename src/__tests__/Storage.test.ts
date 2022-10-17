import { Storage } from '..';

test('test', async () => {
  const storage = new Storage(`/tmp/${Date.now()}`);
  const id = 'test-key-1';
  const type = 'test-type-1';
  const value = { test: 'value' };
  await storage.save(type, id, value);
  const result = await storage.get(type, id);
  expect(result).toEqual({
    _value: { test: 'value' },
    _type: 'test-type-1',
    _version: 1,
    _created: expect.any(Number),
    _id: 'test-key-1',
    _updatedAt: expect.any(Number),
  });
});

test('list', async () => {
  const storage = new Storage(`/tmp/${Date.now()}`);
  const id = 'test-key-1';
  const type = 'test-type-1';
  const value = { test: 'value' };
  await storage.save(type, id, value);
  const result = await storage.list(type);
  expect(result.length).toEqual(1);
  
});
