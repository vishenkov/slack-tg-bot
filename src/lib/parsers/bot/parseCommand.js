import getArtifact from './getArtifact';
import logger from '../../logger';
import errors from './errors';

const log = logger('bot-command-parser');

export default (command) => {
  const commands = {
    tasks(message) {
      const result = /^(?:tasks)(?: (US|DE))(?:([0-9]+))$/.exec(message);
      if (!result) throw new Error(errors(command));
      const artifact = getArtifact(result[1], result[2]);
      log('command [tasks]:', artifact);

      return {
        command,
        artifact,
        message,
      };
    },

    search(message) {
      const result = /^(?:search)(?: ([^?]+))(?: \? (.*))$/.exec(message);
      if (!result) throw new Error(errors(command));
      log('command [search]:', 'project:', result[1], 'key:', result[2]);

      return {
        command,
        project: result[1],
        key: result[2],
        message,
      };
    },

    create(message) {
      const result = /^(?:create task)(?: (US|DE))(?:([0-9]+))(?: (...+))$/.exec(message);
      // const result = /^(?:create task)(?: ([A-Za-z]{2}))(?:([0-9]+))(?: ([a-zA-Z\s\d]+))$/.exec(message);
      log(result);
      if (!result) throw new Error(errors(command));
      const artifact = getArtifact(result[1], result[2]);
      log('command [create task]:', 'artifact:', artifact, 'name:', result[3]);

      return {
        command,
        artifact,
        name: result[3],
        message,
      };
    },

    accept(message) {
      const result = /^(?:accept)(?: (US|DE))(?:([0-9]+))$/.exec(message);
      if (!result) throw new Error(errors(command));
      const artifact = getArtifact(result[1], result[2]);
      log('command [accept]:', 'artifact:', artifact);

      return {
        command,
        artifact,
        message,
      };
    },

    complete(message) {
      const result = /^(?:complete)(?: (US|DE|TA))(?:([0-9]+))$/.exec(message);
      if (!result) throw new Error(errors(command));
      const artifact = getArtifact(result[1], result[2]);
      log('command [complete]:', 'artifact:', artifact);

      return {
        command,
        artifact,
        message,
      };
    },

    start(message) {
      const result = /^(?:start)(?: (US|DE|TA))(?:([0-9]+))$/.exec(message);
      if (!result) throw new Error(errors(command));
      const artifact = getArtifact(result[1], result[2]);
      log('command [start]:', 'artifact:', artifact);

      return {
        command,
        artifact,
        message,
      };
    },

    open(message) {
      const result = /^(?:open)(?: DE([0-9]+))$/.exec(message);
      if (!result) throw new Error(errors(command));
      const artifact = getArtifact('DE', result[1]);
      log('command [open]:', 'artifact:', artifact);

      return {
        command,
        artifact,
        message,
      };
    },

    fix(message) {
      const result = /^(?:fix)(?: DE([0-9]+))$/.exec(message);
      if (!result) throw new Error(errors(command));
      const artifact = getArtifact('DE', result[1]);
      log('command [fix]:', 'artifact:', artifact);

      return {
        command,
        artifact,
        message,
      };
    },

    close(message) {
      const result = /^(?:close)(?: DE([0-9]+))$/.exec(message);
      if (!result) throw new Error(errors(command));
      const artifact = getArtifact('DE', result[1]);
      log('command [close]:', 'artifact:', artifact);

      return {
        command,
        artifact,
        message,
      };
    },

    state(message) {
      const result = /^(?:state)(?: (DE|TA|US))(?:([0-9]+))$/.exec(message);
      log(result);
      if (!result) throw new Error(errors(command));
      const artifact = getArtifact(result[1], result[2]);
      log('command [state]:', 'artifact:', artifact);

      return {
        command,
        artifact,
        message,
      };
    },

    scstate(message) {
      const result = /^(?:scstate)(?: (US|DE))(?:([0-9]+))$/.exec(message);
      if (!result) throw new Error(errors(command));
      const artifact = getArtifact(result[1], result[2]);
      log('command [scstate]:', 'artifact:', artifact);

      return {
        command,
        artifact,
        message,
      };
    },

    help(message) {
      const result = /^(?:help)(?: (\w))$/.exec(message);
      const key = result ? result[1] : '';
      log('command [help]:', 'key:', key);

      return {
        command,
        key,
        message,
      };
    },
  };

  if (!commands[command]) throw new Error(errors('unknown'));
  return commands[command];
};
