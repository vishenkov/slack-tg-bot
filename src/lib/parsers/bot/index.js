import logger from '../../logger';
import parse from './parseCommand';

const log = logger('bot-parser');
export default (message) => {
  log('Got message:', message);
  const command = message.trim().split(' ')[0].toLowerCase();
  log('Parsed comand:', command);
  return parse(command)(message);
};
