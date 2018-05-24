import { resolve } from 'url';
import logger from '../lib/logger';

const log = logger('rallyRequestType');

export default (config) => {
  const rallyUrl = config.rally.url;
  const { rallyHost } = config.rally;
  const baseURL = resolve(rallyHost, '/apps/pigeon/api/v2/webhook');
  log(`Resolved Rally base url: ${baseURL}`);

  const botUrl = config.bot.url;
  const route = resolve('/', botUrl.listenRoute);
  const webhook = `${botUrl.protocol}://${botUrl.host}${route}`;
  log(`Resolved webhook: ${webhook}`);

  const baseHeaders = {
    method: 'get',
    baseURL,
    withCredentials: true,
    headers: {
      Host: rallyUrl.host,
      Cookie: `ZSESSIONID=${process.env.RALLYAPI}`,
    },
  };

  return {
    get: {
      ...baseHeaders,
      params: {
        pagesize: 200,
        // limit: Infinity, // not supported
        start: 1,
      },
    },
    post: {
      ...baseHeaders,
      method: 'post',
      data: {
        AppName: 'Rally-bot',
        AppUrl: 'https://slack.com',
        Name: config.rally.name,
        TargetUrl: webhook,
        ObjectTypes: ['HierarchicalRequirement'], // User Story
        Expressions: [
          {
            Operator: 'changed',
            AttributeID: 'f5b1fb22-6c15-44b5-a592-19189fafe5f2', // Version Id
          },
        ],
      },
    },
    delete: {
      ...baseHeaders,
      method: 'delete',
    },
  };
};

