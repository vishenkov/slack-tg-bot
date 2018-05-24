import Botkit from 'botkit';
import logger from '../../lib/logger';
import responses from './responses';

const log = logger('slack-bot');

export default ({ config, rally }) => {
  const { bot: { channel } } = config;
  if (process.env.SLACKKEY) {
    log('Slack bot key provided.');
  } else {
    console.warn('Slack Bot Key Token is empty! Please, set environment variable SLACKKEY');
    log('Slack bot key is empty!');
  }

  const controller = Botkit.slackbot({
    debug: true,
    retry: Infinity,
  });

  const slackBot = controller.spawn({
    token: process.env.SLACKKEY,
  }).startRTM();

  controller.hears(['shutdown'], 'direct_message,direct_mention,mention', (bot, message) => {
    bot.startConversation(message, (err, convo) => {
      convo.ask('Are you sure you want me to shutdown? (yes/no)', [
        {
          pattern: bot.utterances.yes,
          callback() {
            convo.say('Bye!');
            convo.next();
            setTimeout(() => {
              process.exit();
            }, 3000);
          },
        },
        {
          pattern: bot.utterances.no,
          default: true,
          callback() {
            convo.say('*Working!*');
            convo.next();
          },
        },
      ]);
    });
  });


  controller.on('direct_message', async (bot, message) => {
    log('bot received', message);
    try {
      const { command, response } = await rally(message.text);
      bot.reply(message, responses(command)(response));
    } catch (err) {
      bot.reply(message, responses('error')(err.message));
    }
  });

  return {
    bot: slackBot,
    say(message) {
      const messageBase = {
        channel,
        mrkdwn: true,
      };

      if (typeof message === 'string') {
        this.bot.say({
          ...messageBase,
          text: message,
        });
      } else {
        const { userStory, changes, detailLink } = message;
        const workspace = userStory.Workspace.value || '';
        const owner = userStory.Owner.value ? `Owner: ${userStory.Owner.value}` : '';

        const attachments = [{
          fallback: 'User Story Changes',
          color: userStory.DisplayColor.value || '#21a2e0',
          title: `${userStory.FormattedID.value}\t${userStory.Project.value}\t${userStory.FlowState.value}\t${userStory.PlanEstimate.value || 0} Points\tParent: ${userStory.Parent.value ? 'Yes' : 'No'}`,
          title_link: detailLink || 'https://rally1.rallydev.com',
          text: `${changes.join('\n')}`,
          mrkdwn_in: ['text', 'pretext', 'fields'],
          footer: `${workspace}\t${owner}`,
        }];

        this.bot.say({
          ...messageBase,
          attachments,
        });
      }
    },
  };
};

