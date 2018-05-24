import logger from '../lib/logger';
import slackBot from './slack';
import tgBot from './telegram';

const log = logger('bots');

export default (container) => {
  const { bot: { type } } = container.config;
  log('Bot type:', type);

  switch (type) {
    case 'slack':
      return slackBot(container);
    case 'telegram':
      return tgBot(container);
    default:
      return slackBot(container);
  }
};
