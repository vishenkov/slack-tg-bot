import nock from 'nock';

import getConfig from '../src/container/config';
import getWebhook from '../src/container/webhook';

const config = getConfig({
  rally: {
    url: {
      protocol: 'http',
      host: 'localhost',
    },
  },
});

const webhook = getWebhook(config);

const host = config.rally.rallyHost;
const route = '/apps/pigeon/api/v2/webhook';
const getRoute = `${route}?pagesize=200&start=1`;

const ObjectUUID = 'webhook-ref-id';

describe('nocking auth', () => {
  test('Received OK [first time post]', async () => {
    nock(host)
      .get(getRoute)
      .reply(200, { Results: [] })
      .post(route)
      .reply(200, { ObjectUUID });

    expect.assertions(1);
    webhook.clear();
    const msg = await webhook.init();
    expect(msg.ObjectUUID).toBe(ObjectUUID);
  });

  test('Received OK [next time post]', async () => {
    nock(host)
      .get(getRoute)
      .reply(200, { Results: [{ Name: config.rally.name, ObjectUUID: 'some-object-uuid' }] })
      .delete(`${route}/some-object-uuid`)
      .reply(200)
      .post(route)
      .reply(200, { ObjectUUID });

    expect.assertions(1);
    webhook.clear();
    const msg = await webhook.init();
    expect(msg.ObjectUUID).toBe(ObjectUUID);
  });

  test('Received OK [filter existing other names webhooks]', async () => {
    nock(host)
      .get(getRoute)
      .reply(200, {
        Results: [
          {
            Name: 'Some-name#1',
            ObjectUUID: 'some-object-uuid#1',
          },
          {
            Name: 'Some-name#2',
            ObjectUUID: 'some-object-uuid#2',
          },
          {
            Name: config.rally.name,
            ObjectUUID: 'some-object-uuid',
          },
        ],
      })
      .delete(`${route}/some-object-uuid`)
      .reply(200)
      .post(route)
      .reply(200, { ObjectUUID });

    expect.assertions(1);
    webhook.clear();
    const msg = await webhook.init();
    expect(msg.ObjectUUID).toBe(ObjectUUID);
  });

  test('Received OK [next time post + many existing Webhooks Results]', async () => {
    const results = Array(200).fill(0).map(() => ({
      Name: config.rally.name,
      ObjectUUID: 'some-object-uuid',
    }));
    nock(host)
      .get(getRoute)
      .reply(200, {
        TotalResultCount: 201,
        Results: [...results],
      })
      .get(`${route}?pagesize=200&start=201`)
      .reply(200, {
        Results: [{ ObjectUUID: 'some-object-uuid#201' }],
      })
      .delete(`${route}/some-object-uuid#201`)
      .once()
      .reply(200)
      .delete(`${route}/some-object-uuid`)
      .times(results.length + 1)
      .reply(200)
      .post(route)
      .reply(200, { ObjectUUID });

    expect.assertions(1);
    webhook.clear();
    const msg = await webhook.init();
    expect(msg.ObjectUUID).toBe(ObjectUUID);
  });

  test('Auth Error', async () => {
    nock(host)
      .get(getRoute)
      .reply(401);

    expect.assertions(1);
    try {
      webhook.clear();
      await webhook.init();
    } catch (err) {
      expect(err instanceof Error).toBeTruthy();
    }
  });

  test('Get Error', async () => {
    nock(host)
      .get(getRoute)
      .reply(404);

    expect.assertions(1);
    try {
      webhook.clear();
      await webhook.init();
    } catch (err) {
      expect(err instanceof Error).toBeTruthy();
    }
  });

  test('Delete Error', async () => {
    nock(host)
      .get(getRoute)
      .reply(200, { Results: [{ Name: config.rally.name, ObjectUUID: 'some-object-uuid' }] })
      .delete(`${route}/some-object-uuid`)
      .reply(404);

    expect.assertions(1);
    try {
      webhook.clear();
      await webhook.init();
    } catch (err) {
      expect(err instanceof Error).toBeTruthy();
    }
  });

  test('Post Error', async () => {
    nock(host)
      .get(getRoute)
      .reply(200, { Results: [{ Name: config.rally.name, ObjectUUID: 'some-object-uuid' }] })
      .delete(`${route}/some-object-uuid`)
      .reply(200)
      .post(route)
      .reply(400, {});

    expect.assertions(1);
    try {
      webhook.clear();
      await webhook.init();
    } catch (err) {
      expect(err instanceof Error).toBeTruthy();
    }
  });

  test('Rally server error', async () => {
    process.env.RALLYREF = 'some-ref';
    nock(host)
      .get(getRoute)
      .reply(501, {});

    expect.assertions(1);
    try {
      webhook.clear();
      await webhook.init();
    } catch (err) {
      expect(err instanceof Error).toBeTruthy();
    }
  });


  test('Bad query request to Rally', async () => {
    nock(host)
      .get(getRoute)
      .reply(200, { Results: [] })
      .post(route)
      .reply(400, {});

    expect.assertions(1);
    try {
      webhook.clear();
      await webhook.init();
    } catch (err) {
      expect(err instanceof Error).toBeTruthy();
    }
  });
});
