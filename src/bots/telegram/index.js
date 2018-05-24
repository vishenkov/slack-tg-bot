import Telegraf from 'telegraf';
import Markup from 'telegraf/markup';
import logger from '../../lib/logger';
import responses from './responses';

const log = logger('telegram-bot');

export default ({ config, rally }) => {
  const { bot: { channel, users } } = config;
  if (process.env.TELEGRAMKEY) {
    log('Telegram bot key provided.');
  } else {
    console.warn('Telegram Bot Key Token is empty! Please, set environment variable TELEGRAMKEY');
    log('Telegram bot key is empty!');
  }

  const bot = new Telegraf(process.env.TELEGRAMKEY);

  bot.start((ctx) => {
    console.log('started:', ctx.from.id);
    return ctx.reply('Welcome!');
  });

  bot.command('shutdown', ({ reply }) =>
    reply('Are you sure you want me to shutdown?', Markup
      .keyboard(['/yes', '/no'])
      .oneTime()
      .resize()
      .extra()));

  bot.command('yes', (ctx) => {
    setTimeout(() => {
      process.exit();
    }, 3000);
    return ctx.reply('Bye!');
  });

  bot.command('no', ctx => ctx.reply('Working!'));

  bot.command('myid', ctx => ctx.reply(`Your telegram id is: ${ctx.update.message.from.id}`));
  bot.on('message', async (ctx) => {
    log(ctx.update.message.from);
    const { message } = ctx.update;
    const { id } = message.from;
    if (users.filter(userId => userId === id).length === 0) {
      return ctx.replyWithMarkdown(responses('error')('Not authorized!\nPlease add your *id* to _config.json_\nTo get your id: type `/myid`'));
    }
    log('bot received:', message.text);
    try {
      const { command, response } = await rally(message.text);
      const replyMsg = responses(command)(response);
      // log(replyMsg);
      return ctx.replyWithMarkdown(replyMsg);
    } catch (err) {
      return ctx.replyWithMarkdown(responses('error')(err.message));
    }
  });

  bot.startPolling();

  return {
    bot,
    say(message) {
      if (typeof message === 'string') {
        this.bot
          .telegram.sendMessage(channel, message, { parse_mode: 'Markdown' });
      } else {
        const { userStory, changes, detailLink } = message;

        const workspace = `_${userStory.Workspace.value}_` || '';
        const owner = userStory.Owner.value ? `_Owner: ${userStory.Owner.value}_` : '';
        const formattedID = userStory.FormattedID.value;
        const project = userStory.Project.value;
        const flowState = userStory.FlowState.value;
        const plan = `${userStory.PlanEstimate.value || 0} Points`;
        const changesText = changes.join('\n');
        const details = `[details](${detailLink})`;

        const header = [formattedID, project, flowState, plan].filter(txt => txt.length !== 0).join(' | ');

        const footer = [workspace, owner, details].filter(txt => txt.length !== 0).join(' | ');

        const msg = `${header}\n${changesText}\n${footer}`;

        this.bot
          .telegram.sendMessage(channel, msg, { parse_mode: 'Markdown' })
          .catch(err => console.error(err));
      }
    },
  };
};
