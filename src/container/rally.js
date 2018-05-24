import getApi from '../lib/api/rally';
import logger from '../lib/logger';
import parse from '../lib/parsers/bot';

const log = logger('rally');

export default (config) => {
  const api = getApi(config);

  return (message) => {
    const result = parse(message);
    const { command } = result;

    const commands = {
      async tasks() {
        const response = await api.queryTasks(result.artifact);
        log('[tasks]:', response);
        return {
          command,
          response,
        };
      },

      async create() {
        const { artifact, name } = result;
        // log(name, artifact);
        const response = await api.createTask(artifact, name);
        log('[create task]:', response);
        return {
          command,
          response,
        };
      },

      async search() {
        const { project, key } = result;
        const response = await api.search(project, key);
        log('[search]:', response);
        return {
          command,
          response,
        };
      },

      async accept() {
        const { artifact } = result;
        const response = await api.updateScheduleState(artifact, 'Accepted');
        log('[accept]:', response);
        return {
          command,
          response,
        };
      },

      async complete() {
        const { artifact } = result;
        if (artifact.type === 'Task') {
          const response = await api.updateState(artifact, 'Completed');
          log('[complete]:', response);
          return {
            command,
            response,
          };
        }
        const response = await api.updateScheduleState(artifact, 'Completed');
        log('[complete]:', response);
        return {
          command,
          response,
        };
      },

      async start() {
        const { artifact } = result;
        if (artifact.type === 'Task') {
          const response = await api.updateState(artifact, 'In-Progress');
          log('[start]:', response);
          return {
            command,
            response,
          };
        }
        const response = await api.updateScheduleState(artifact, 'In-Progress');
        log('[start]:', response);
        return {
          command,
          response,
        };
      },

      async open() {
        const { artifact } = result;
        const response = await api.updateState(artifact, 'Open');
        log('[open]:', response);
        return {
          command,
          response,
        };
      },

      async fix() {
        const { artifact } = result;
        const response = await api.updateState(artifact, 'Fixed');
        log('[fix]:', response);
        return {
          command,
          response,
        };
      },

      async close() {
        const { artifact } = result;
        const response = await api.updateState(artifact, 'Closed');
        log('[close]:', response);
        return {
          command,
          response,
        };
      },

      async state() {
        const { artifact } = result;
        if (artifact.type === 'UserStory') return commands.scstate();
        const response = await api.queryArtifact(artifact);
        log('[state]:', response);
        return {
          command,
          response,
        };
      },

      async scstate() {
        const { artifact } = result;
        const response = await api.queryArtifact(artifact);
        log('[scstate]:', response);
        return {
          command,
          response,
        };
      },

      async help() {
        const help = [
          ['`tasks <story id | defect id>`', 'fetch tasks for User Story or Defect'],
          ['`create task <story id | defect id> <taskname>`', 'creates new task with given name'],
          ['`state <task id | defect id>`', 'fetch State for Task or Defect'],
          ['`scstate <story id | defect id>`', 'fetch Schedule State for User Story or Defect'],
          ['`search <project name | key>`', 'search given key in User Story names'],
          ['`accept <story id | defect id>`', 'set Schedule State \'Accepted\' for User Story or Defect'],
          ['`start <story id | defect id | task id>`', 'set Schedule State \'In-Progress\' for User Story or Defect OR State \'In-Progress\' for Task'],
          ['`complete <story id | defect id | task id>`', 'set Schedule State \'Completed\' for User Story or Defect OR State \'Completed\' for Task'],
          ['`open <defect id>`', 'set State \'Open\' for Defect'],
          ['`fix <defect id>`', 'set State \'Fixed\' for Defect'],
          ['`close <defect id>`', 'set State \'Close\' for Defect'],
          // ['`help <command>`', 'show detailed help for command'],
        ];
        log('[help]:', 'help length:', help.length);

        return {
          command,
          response: help,
        };
      },

      default() {
        throw new Error(`Not able to parse command: ${command}`);
      },
    };

    return commands[command]() || commands.default();
  };
};
