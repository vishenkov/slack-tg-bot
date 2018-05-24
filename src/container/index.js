import getRallyApi from './rally';
import getWebhook from './webhook';
import getConfig from './config';

const config = getConfig();
const webhook = getWebhook(config);
const rally = getRallyApi(config);

export default { config, webhook, rally };
