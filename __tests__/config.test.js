import getConfig from '../src/container/config';

describe('config parser', () => {
  test('default empty call getConfig', () => {
    const config = getConfig();

    expect(config.rally).not.toBeUndefined();
    expect(config.rally.url).not.toBeUndefined();
    expect(config.rally.url.protocol).not.toBeUndefined();
    expect(config.rally.url.host).not.toBeUndefined();
    expect(config.rally.name).not.toBeUndefined();
    expect(config.rally.attributes).not.toBeUndefined();
    expect(config.rally.rallyHost).not.toBeUndefined();

    expect(config.bot).not.toBeUndefined();
    expect(config.bot.type).not.toBeUndefined();
    expect(config.bot.url).not.toBeUndefined();
    expect(config.bot.url.protocol).not.toBeUndefined();
    expect(config.bot.url.host).not.toBeUndefined();
    expect(config.bot.url.listenRoute).not.toBeUndefined();
    expect(config.bot.url.port).not.toBeUndefined();
    expect(config.bot.channel).not.toBeUndefined();
    expect(config.bot.users).not.toBeUndefined();
  });

  test('default values for empty config', () => {
    const config = getConfig({});

    expect(config.rally).not.toBeUndefined();
    expect(config.rally.url.protocol).toBe('https');
    expect(config.rally.url.host).toBe('rally1.rallydev.com');
    expect(config.rally.name).not.toBeUndefined();
    expect(config.rally.attributes instanceof Array).toBeTruthy();
    expect(config.rally.rallyHost).toBe('https://rally1.rallydev.com');

    expect(config.bot).not.toBeUndefined();
    expect(config.bot.type).not.toBeUndefined();
    expect(config.bot.url.protocol).toBe('http');
    expect(config.bot.url.host).toBeDefined();
    expect(config.bot.url.listenRoute).toBeDefined();
    expect(config.bot.url.port).toBe(3000);
    expect(config.bot.channel).toBeDefined();
    expect(config.bot.users instanceof Array).toBeTruthy();
  });

  test('default port without env variable', () => {
    process.env.PORT = null;
    const config = getConfig({});

    expect(config.bot.url.port).toBe(3000);
    expect(process.env.PORT).toBe(3000);
  });

  test('default port with setted env variable', () => {
    process.env.PORT = 4001;
    const config = getConfig({});

    expect(config.bot.url.port).toBe(3000);
    expect(process.env.PORT).toBe(4001);
  });

  test('default port with setted env variable and setted config', () => {
    process.env.PORT = 4001;
    const config = getConfig({
      bot: {
        url: {
          port: 5000,
        },
      },
    });

    expect(config.bot.url.port).toBe(5000);
    expect(process.env.PORT).toBe(4001);
  });
});
