import table from 'text-table';
import _ from 'lodash';

const createAttachment = (artifact) => {
  const formattedID = `*${artifact.FormattedID}*`;
  const name = `*${artifact.Name}*`;
  const state = artifact.State ? `*State: ${artifact.State}*` : '';
  const scstate = artifact.ScheduleState ? `*SchState: ${artifact.ScheduleState}*` : '';

  const ownerVal = _.get(artifact, 'Owner._refObjectName', '');
  const projectVal = _.get(artifact, 'Project.Name', '');
  const defectsCountVal = _.get(artifact, 'Defects.Count', '');
  const tasksCountVal = _.get(artifact, 'Tasks.Count', '');

  const owner = ownerVal ? `_Owner: ${ownerVal}_` : '';
  const project = projectVal ? `_Project: ${projectVal}_` : '';
  const defectsCount = defectsCountVal ? `_Defects: ${defectsCountVal}_` : '';
  const tasksCount = tasksCountVal ? `_Tasks: ${tasksCountVal}_` : '';
  const plan = artifact.PlanEstimate ? `_PlanEst: ${artifact.PlanEstimate}_` : '';

  const footer = [owner, project, defectsCount, tasksCount, plan].filter(txt => txt.length !== 0).join(' | ');

  const header = [formattedID, name, state, scstate].filter(txt => txt.length !== 0).join(' | ');

  const text = (artifact.Description).replace(/[_*`[\]()]/g, '\\$&') || '';
  const msg = `${header}\n${text}\n${footer}`;

  return msg;
};

const responses = {
  tasks(response) {
    const text = table(
      response.map(({ FormattedID, Name, State }) => [FormattedID, Name, State]),
      { align: ['l', 'c', 'l'] },
    ).replace(/[_*`[\]()]/g, '\\$&');

    if (response.length === 0) {
      return responses.info({
        title: 'Result',
        text: 'No tasks!',
      });
    }

    return responses.info({
      title: 'Tasks',
      text,
    });
  },

  search(response) {
    const res = response.map(us => createAttachment(us));

    if (res.length === 0) {
      return responses.info({
        title: 'Search Results',
        text: 'No results!',
      });
    }

    return res.join('\n');
  },

  create(task) {
    return createAttachment(task);
  },

  accept(artifact) {
    return createAttachment(artifact);
  },

  complete(artifact) {
    return createAttachment(artifact);
  },

  start(artifact) {
    return createAttachment(artifact);
  },

  open(artifact) {
    return createAttachment(artifact);
  },

  fix(artifact) {
    return createAttachment(artifact);
  },

  close(artifact) {
    return createAttachment(artifact);
  },

  state(artifact) {
    return createAttachment(artifact);
  },

  scstate(artifact) {
    return createAttachment(artifact);
  },

  help(messages) {
    // console.log(table(
    //   messages,
    //   { align: ['l', 'l'] },
    // ));
    const text = messages.map(msg => msg.join('\n\t')).join('\n');
    return responses.info({
      title: 'Help',
      text,
    });
  },

  error(message) {
    const msg = `*Error!*\n${message}`;
    return msg;
  },

  default(response) {
    const msg = `*Parser for response is not provided*\n${response}`;
    return msg;
  },

  info({ title, text }) {
    const msg = `*${title || 'Result'}*\n${text}`;
    return msg;
  },
};

export default command => responses[command] || responses.default;
