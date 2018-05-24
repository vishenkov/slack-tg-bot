import rally from 'rally';
import logger from '../../logger';

const queryUtils = rally.util.query;
const refUtils = rally.util.ref;

const log = logger('rally-api');

const fetch = ['FormattedID', 'Name', 'Children', 'Description', 'DisplayColor', 'ScheduleState', 'Tasks', 'Defects', 'Project', 'Owner', 'PlanEstimate', 'State'];


export default (config) => {
  const restApi = rally({
    apiKey: process.env.RALLYAPI,
    apiVersion: 'v2.0',
    server: config.rally.rallyHost,
    requestOptions: {
      headers: {
        'X-RallyIntegrationName': 'messenger-bot integration',
        'X-RallyIntegrationVendor': 'Rally Integration',
        'X-RallyIntegrationVersion': '1.0',
      },
    },
  });

  return {
    async queryUserStory(id) {
      const result = await restApi.query({
        type: 'hierarchicalrequirement',
        start: 1,
        limit: 1,
        order: 'Rank',
        fetch,
        query: queryUtils.where('FormattedID', '=', id),
      });
      log('Queried User Story', result);

      if (result.Results.length === 0) throw new Error(`Not able to User Story for: ${id}`);
      return result.Results[0];
    },

    async queryDefect(id) {
      const result = await restApi.query({
        type: 'defect',
        start: 1,
        limit: 1,
        order: 'Rank',
        fetch,
        query: queryUtils.where('FormattedID', '=', id),
      });

      log('queryDefect: Result Errors', result.Errors);
      if (result.Results.length === 0) throw new Error(`Not able to find Defect for: ${id}`);
      return result.Results[0];
    },

    async queryTask(id) {
      const result = await restApi.query({
        type: 'task',
        start: 1,
        limit: 1,
        order: 'Rank',
        fetch,
        query: queryUtils.where('FormattedID', '=', id),
      });

      log('queryDefect: Result Errors', result.Errors);
      if (result.Results.length === 0) throw new Error(`Not able to find Task for: ${id}`);
      return result.Results[0];
    },

    async queryArtifact(artifact) {
      switch (artifact.type) {
        case 'UserStory': {
          const result = await this.queryUserStory(artifact.id);
          return result;
        }
        case 'Defect': {
          const result = await this.queryDefect(artifact.id);
          return result;
        }
        case 'Task': {
          const result = await this.queryTask(artifact.id);
          return result;
        }
        default:
          throw new Error(`Not able to parse Artifact type: ${artifact.type}`);
      }
    },

    async createTask(parent, name) {
      const parentRef = await this.queryArtifact(parent);

      const result = await restApi.add({
        ref: parentRef,
        collection: 'Tasks',
        data: [
          { Name: name },
        ],
        fetch,
      });

      if (result.Results.length === 0) throw new Error('Not able to create Task');
      return result.Results[0];
    },

    async queryTasks(parent) {
      const parentArtifact = await this.queryArtifact(parent);
      log('Queried parent', parentArtifact);
      const ref = refUtils.getRelative(parentArtifact);
      log('Parent ref:', ref);

      const result = await restApi.query({
        ref: `${ref}/tasks`,
        start: 1,
        // pageSize: 200,
        limit: Infinity,
        order: 'Rank',
        fetch,
      });

      return result.Results;
    },

    async updateState(artifact, state) {
      const ref = await this.queryArtifact(artifact);
      log('Queried Artifact', ref);

      const result = await restApi.update({
        ref,
        data: {
          State: state,
        },
        fetch,
      });

      return result.Object;
    },

    async updateScheduleState(artifact, state) {
      const ref = await this.queryArtifact(artifact);
      log('Queried Artifact', ref);

      const result = await restApi.update({
        ref,
        data: {
          ScheduleState: state,
        },
        fetch,
      });

      return result.Object;
    },

    async search(projectName, key) {
      const result = await restApi.query({
        type: 'hierarchicalrequirement',
        start: 1,
        limit: Infinity,
        order: 'Rank',
        fetch,
        query: queryUtils.where('Project.Name', '=', projectName).and('Name', 'contains', key),
      });

      log('search: Result Errors', result.Errors);
      return result.Results;
    },
  };
};
