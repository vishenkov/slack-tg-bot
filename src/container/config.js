import env from 'dotenv';
import _ from 'lodash';
import { hostname } from 'os';

import logger from '../lib/logger';
import configJson from '../../config.json';

const log = logger('config');
env.config();

if (process.env.RALLYAPI) {
  log('Rally api key provided.');
} else {
  console.warn('Rally Api Key is empty! Please, set environment variable RALLYAPI');
  log('Rally api key is empty!');
}

if (process.env.PORT) {
  log(`Environment variable PORT provided: ${process.env.PORT}.`);
}

export default (providedConfig = configJson) => {
  const config = {};
  config.rally = _.get(providedConfig, 'rally', {});
  config.bot = _.get(providedConfig, 'bot', {});

  config.rally.url = _.get(providedConfig, 'rally.url', {});
  config.rally.url.protocol = _.get(providedConfig, 'rally.url.protocol', 'https');
  config.rally.url.host = _.get(providedConfig, 'rally.url.host', 'rally1.rallydev.com');
  config.rally.name = _.get(providedConfig, 'rally.name', 'bot-chat-webhook');
  config.rally.attributes = _.get(providedConfig, 'rally.attributes', ['Name', 'Description', 'Parent', 'ScheduleState']);

  config.bot.type = _.get(providedConfig, 'bot.type', 'slack');
  config.bot.url = _.get(providedConfig, 'bot.url', {});
  config.bot.url.protocol = _.get(providedConfig, 'bot.url.protocol', 'http');
  config.bot.url.host = _.get(providedConfig, 'bot.url.host', hostname());
  config.bot.url.listenRoute = _.get(providedConfig, 'bot.url.listenRoute', '/user-story');
  config.bot.url.port = _.get(providedConfig, 'bot.url.port', 3000);
  config.bot.channel = _.get(providedConfig, 'bot.channel', 'general');
  config.bot.users = _.get(providedConfig, 'bot.users', []);

  const rallyUrl = config.rally.url;
  config.rally.rallyHost = `${rallyUrl.protocol}://${rallyUrl.host}`;

  process.env.PORT = process.env.PORT || config.bot.url.port;

  return config;
};
