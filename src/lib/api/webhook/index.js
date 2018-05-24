import axios from '../../axios';
import logger from '../../logger';
import getRequestType from '../../rallyRequestType';

const log = logger('webhook-api');

export default (config) => {
  const requestType = getRequestType(config);

  return {
    async init() {
      if (this.response) return this.response;

      try {
        const getResponse = await axios({
          ...requestType.get,
        });

        if (!getResponse.data) throw new Error('Unexpected answer from Rally.');

        const existingWebhooks = getResponse.data.Results;
        const totalResultCount = getResponse.data.TotalResultCount;
        const pageSize = Math.min(requestType.get.params.pagesize, 200);
        const pages = Math.ceil(totalResultCount / pageSize);
        log(`Existing Webhooks count: ${getResponse.data.TotalResultCount}, pages: ${pages}`);

        if (totalResultCount > existingWebhooks.length) {
          const getResponses = await Promise.all(Array(pages - 1)
            .fill(0)
            .map((val, index) => axios({
              ...requestType.get,
              params: {
                ...requestType.get.params,
                start: ((index + 1) * pageSize) + 1,
              },
            }).catch((err) => {
              log('axios get request fail', err.message);
              throw err;
            })));

          getResponses.forEach(res => existingWebhooks.push(...res.data.Results));
        }

        log('Total webhooks fetched:', existingWebhooks.length);

        const filteredExistingWebhooks = existingWebhooks
          .filter(({ Name }) => Name === config.rally.name);

        // log('filtered webhooks by name', filteredExistingWebhooks.length);

        await Promise.all(filteredExistingWebhooks.map(res =>
          axios({
            ...requestType.delete,
            url: res.ObjectUUID,
          }).catch((err) => {
            log('axios delete request fail', err.message);
            throw err;
          })));

        const response = await axios({
          ...requestType.post,
        });

        // Promise.all(Array(400).fill(0).map(() => axios({
        //   ...requestType.post,
        // })));

        const { ObjectUUID } = response.data;
        log('Received ref:', ObjectUUID);
        // return `Success!\nWebhook Ref: *${ObjectUUID}*`;
        this.response = response.data;
        return response.data;
      } catch (err) {
        log('axios response fail', err);
        log('axios response fail', err.message);
        // log('axios response fail', err.response.data);
        throw new Error(`Unexpected response from Rally: ${err.message}`);
      }
    },
    clear() {
      log('Clear init result');
      this.response = null;
    },
  };
};
