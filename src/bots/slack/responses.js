import table from 'text-table';
import _ from 'lodash';

const createAttachment = (artifact) => {
  const state = artifact.State ? `\tState: ${artifact.State}` : '';
  const scstate = artifact.ScheduleState ? `\tSchedule State: ${artifact.ScheduleState}` : '';
  const plan = artifact.PlanEstimate ? `Plan Est: ${artifact.PlanEstimate}` : '';

  const ownerVal = _.get(artifact, 'Owner._refObjectName', '');
  const projectVal = _.get(artifact, 'Project.Name', '');
  const defectsCountVal = _.get(artifact, 'Defects.Count', '');
  const tasksCountVal = _.get(artifact, 'Tasks.Count', '');

  const owner = ownerVal ? `Owner: ${ownerVal}` : '';
  const project = projectVal ? `Project: ${projectVal}` : '';
  const defectsCount = defectsCountVal ? `Defects: ${defectsCountVal}` : '';
  const tasksCount = tasksCountVal ? `Tasks: ${tasksCountVal}` : '';

  const footer = [owner, project, defectsCount, tasksCount, plan].filter(txt => txt.length !== 0).join('\t');

  const attachment = {
    fallback: `Artifact ${artifact.Name}`,
    color: artifact.DisplayColor || '#CCC',
    title: `${artifact.FormattedID}\t${artifact.Name}${state}${scstate}`,
    title_link: artifact._ref,
    text: artifact.Description || '',
    mrkdwn_in: ['text', 'pretext', 'fields'],
    footer,
  };

  return attachment;
};

const responses = {
  tasks(response) {
    const text = table(
      response.map(({ FormattedID, Name, State }) => [FormattedID, Name, State]),
      { align: ['l', 'c', 'l'] },
    );

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
    const attachments = response.map(us => createAttachment(us));

    if (attachments.length === 0) {
      return responses.info({
        title: 'Search Results',
        text: 'No results!',
      });
    }

    return {
      attachments,
    };
  },

  create(task) {
    const attachments = [createAttachment(task)];

    return {
      attachments,
    };
  },

  accept(artifact) {
    const attachments = [{
      ...createAttachment(artifact),
      pretext: 'Success!',
    }];

    return {
      attachments,
    };
  },

  complete(artifact) {
    const attachments = [{
      ...createAttachment(artifact),
      pretext: 'Success!',
    }];

    return {
      attachments,
    };
  },

  start(artifact) {
    const attachments = [{
      ...createAttachment(artifact),
      pretext: 'Success!',
    }];

    return {
      attachments,
    };
  },

  open(artifact) {
    const attachments = [{
      ...createAttachment(artifact),
      pretext: 'Success!',
    }];

    return {
      attachments,
    };
  },

  fix(artifact) {
    const attachments = [{
      ...createAttachment(artifact),
      pretext: 'Success!',
    }];

    return {
      attachments,
    };
  },

  close(artifact) {
    const attachments = [{
      ...createAttachment(artifact),
      pretext: 'Success!',
    }];

    return {
      attachments,
    };
  },

  state(artifact) {
    const attachments = [createAttachment(artifact)];

    return {
      attachments,
    };
  },

  scstate(artifact) {
    const attachments = [createAttachment(artifact)];

    return {
      attachments,
    };
  },

  help(messages) {
    // const text = table(
    //   messages,
    //   { align: ['l', 'l'] },
    // );
    const text = messages.map(msg => msg.join('\n\t')).join('\n');
    return responses.info({
      title: 'Help',
      text,
    });
  },

  error(message) {
    const attachments = [{
      pretext: 'Error!',
      fallback: message,
      color: '#CC0000',
      title: 'Error response from server',
      text: message,
      mrkdwn_in: ['text', 'pretext', 'fields'],
    }];
    return {
      attachments,
    };
  },

  default(response) {
    const attachments = [{
      pretext: 'Raw Data',
      fallback: 'Default Response',
      color: '#9F6000',
      title: 'Parser for response is not provided',
      text: response,
      mrkdwn_in: ['text', 'pretext', 'fields'],
    }];
    return {
      attachments,
    };
  },

  info(message) {
    const attachments = [{
      fallback: 'Default Response',
      color: '#FFCC00',
      title: message.title || 'Result',
      text: message.text || '',
      mrkdwn_in: ['text', 'pretext', 'fields'],
    }];
    return {
      attachments,
    };
  },
};

export default command => responses[command] || responses.default;
