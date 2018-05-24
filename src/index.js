import 'babel-polyfill';
import logger from './lib/logger';
import server from './server';
import getBot from './bots';
import container from './container';

const log = logger('main');

const { config, webhook } = container;
const botUrl = config.bot.url;
const host = `${botUrl.protocol}://localhost:${process.env.PORT}`;

(async () => {
  const bot = getBot(container);

  log('Connecting to Rally');
  try {
    const response = await webhook.init();
    log('Registered Webhook at Rally, Got ObjectUUID:', response.ObjectUUID);
    bot.say('Bot successfully subscribed to User Story updates!');
  } catch (err) {
    console.error(err);
    bot.say(err.message);
    setTimeout(() => {
      process.exit(1);
    }, 3000);
  }

  server(config, bot)
    .listen(process.env.PORT, () => console.log(`Server started at ${host}`));
})();
