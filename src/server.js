import express from 'express';
import bodyParser from 'body-parser';
import parse from './lib/parsers/webhook';
import filterChanges from './lib/filterChanges';

export default (config, bot) => {
  const app = express();

  app.use(bodyParser.json());

  app.get('/', (req, res) => {
    res.end('Simple bot for Slack.');
  });

  app.post(config.bot.url.listenRoute, (req, res) => {
    const userStory = parse(req.body.message);
    const changes = filterChanges(userStory.changes, config.rally.attributes);

    if (changes.length) {
      bot.say({
        userStory,
        changes,
        detailLink: req.body.message.detail_link,
      });
    }

    res.end();
  });

  return app;
};
