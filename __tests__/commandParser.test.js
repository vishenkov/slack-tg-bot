import parse from '../src/lib/parsers/bot';

describe('command parser', () => {
  test('command [create task]', () => {
    const de1 = parse('create task DE1 New Name');
    const us1 = parse('create task US1 New Name');
    const us2 = parse('create task US2 _#$%^&*()-=!@123 Name~`\'"/\\?±§');

    expect.assertions(8);

    expect(de1.artifact.type).toBe('Defect');
    expect(de1.command).toBe('create');
    expect(us1.artifact.type).toBe('UserStory');
    expect(us2.artifact.type).toBe('UserStory');

    try {
      const res = parse('create task TA1 New Name');
      console.log(res);
    } catch (err) {
      expect(err.message.indexOf('create task') >= 0).toBeTruthy();
    }

    try {
      const res = parse('create task');
      console.log(res);
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      const res = parse('create task  DE1  New Name');
      console.log(res);
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      const res = parse('create task FF1 New Name');
      console.log(res);
    } catch (err) {
      expect(err.message.indexOf('create task') >= 0).toBeTruthy();
    }
  });

  test('command [tasks]', () => {
    const de1 = parse('tasks DE1');
    const us1 = parse('tasks US1');

    expect.assertions(8);

    expect(de1.artifact.type).toBe('Defect');
    expect(de1.command).toBe('tasks');
    expect(us1.artifact.type).toBe('UserStory');

    try {
      parse('tasks TA1');
    } catch (err) {
      expect(err.message.indexOf('tasks') >= 0).toBeTruthy();
    }

    try {
      parse('tasks');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('tasks  DE1');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('tasks FF1');
    } catch (err) {
      expect(err.message.indexOf('tasks') >= 0).toBeTruthy();
    }

    try {
      parse('tasks US1 another_arg');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }
  });

  test('command [state]', () => {
    const de1 = parse('state DE1');
    const us1 = parse('state US1');
    const ta1 = parse('state TA1');

    expect.assertions(8);

    expect(de1.artifact.type).toBe('Defect');
    expect(de1.command).toBe('state');
    expect(us1.artifact.type).toBe('UserStory');
    expect(ta1.artifact.type).toBe('Task');

    try {
      parse('state FF1');
    } catch (err) {
      expect(err.message.indexOf('state') >= 0).toBeTruthy();
    }

    try {
      parse('state');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('state  DE1');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('state US1 another_arg');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }
  });

  test('command [scstate]', () => {
    const de1 = parse('scstate DE1');
    const us1 = parse('scstate US1');

    expect.assertions(7);

    expect(de1.artifact.type).toBe('Defect');
    expect(de1.command).toBe('scstate');
    expect(us1.artifact.type).toBe('UserStory');

    try {
      parse('scstate FF1');
    } catch (err) {
      expect(err.message.indexOf('scstate') >= 0).toBeTruthy();
    }

    try {
      parse('scstate');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('scstate  DE1');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('scstate US1 another_arg');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }
  });

  test('command [complete]', () => {
    const de1 = parse('complete DE1');
    const us1 = parse('complete US1');
    const ta1 = parse('complete TA1');

    expect.assertions(8);

    expect(de1.artifact.type).toBe('Defect');
    expect(de1.command).toBe('complete');
    expect(us1.artifact.type).toBe('UserStory');
    expect(ta1.artifact.type).toBe('Task');

    try {
      parse('complete FF1');
    } catch (err) {
      expect(err.message.indexOf('complete') >= 0).toBeTruthy();
    }

    try {
      parse('complete');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('complete  DE1');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('complete US1 another_arg');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }
  });

  test('command [accept]', () => {
    const de1 = parse('accept DE1');
    const us1 = parse('accept US1');

    expect.assertions(7);

    expect(de1.artifact.type).toBe('Defect');
    expect(de1.command).toBe('accept');
    expect(us1.artifact.type).toBe('UserStory');

    try {
      parse('accept FF1');
    } catch (err) {
      expect(err.message.indexOf('accept') >= 0).toBeTruthy();
    }

    try {
      parse('accept');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('accept  DE1');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('accept US1 another_arg');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }
  });

  test('command [start]', () => {
    const de1 = parse('start DE1');
    const us1 = parse('start US1');
    const ta1 = parse('start TA1');

    expect.assertions(8);

    expect(de1.artifact.type).toBe('Defect');
    expect(de1.command).toBe('start');
    expect(us1.artifact.type).toBe('UserStory');
    expect(ta1.artifact.type).toBe('Task');

    try {
      parse('start FF1');
    } catch (err) {
      expect(err.message.indexOf('start') >= 0).toBeTruthy();
    }

    try {
      parse('start');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('start  DE1');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('start US1 another_arg');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }
  });

  test('command [open]', () => {
    const de1 = parse('open DE1');

    expect.assertions(8);

    expect(de1.artifact.type).toBe('Defect');
    expect(de1.command).toBe('open');

    try {
      parse('open FF1');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('open US1');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('open TA1');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('open');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('open  DE1');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('open DE1 another_arg');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }
  });

  test('command [fix]', () => {
    const de1 = parse('fix DE1');

    expect.assertions(8);

    expect(de1.artifact.type).toBe('Defect');
    expect(de1.command).toBe('fix');

    try {
      parse('fix FF1');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('fix US1');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('fix TA1');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('fix');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('fix  DE1');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('fix DE1 another_arg');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }
  });

  test('command [close]', () => {
    const de1 = parse('close DE1');

    expect.assertions(8);

    expect(de1.artifact.type).toBe('Defect');
    expect(de1.command).toBe('close');

    try {
      parse('close FF1');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('close US1');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('close TA1');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('close');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('close  DE1');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('close DE1 another_arg');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }
  });

  test('command [search]', () => {
    const search = parse('search Project Name ? keyword');
    const search2 = parse('search Project Name ? keyword ? another_keyword');

    expect.assertions(7);

    expect(search.project).toBe('Project Name');
    expect(search.key).toBe('keyword');
    expect(search.command).toBe('search');
    expect(search2.key).toBe('keyword ? another_keyword');

    try {
      parse('search Project Name');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('search Project Name ?');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }

    try {
      parse('open');
    } catch (err) {
      expect(err.message.indexOf('Command format') >= 0).toBeTruthy();
    }
  });
});
