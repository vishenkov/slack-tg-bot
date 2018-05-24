import getChanges from '../src/lib/parsers/webhook/getChanges';
import getProps from '../src/lib/parsers/webhook/getProps';

describe('testing getProps', () => {
  const state = {
    'b0778de0-a927-11e2-9e96-0800200c9a66': {
      value: '#21a2e0',
      type: 'String',
      name: 'DisplayColor',
      display_name: 'Display Color',
      ref: null,
    },
    '500a0d67-9c48-4145-920c-821033e4a832': {
      value: 'Browse safari',
      type: 'String',
      name: 'Name',
      display_name: 'Name',
      ref: null,
    },
    '727a8977-f3a5-4713-9415-ac97471cc736': {
      value: false,
      type: 'Boolean',
      name: 'Ready',
      display_name: 'Ready',
      ref: null,
    },
    '557393c4-131b-4df7-b01e-5319b11edd24': {
      value: null,
      type: 'User',
      name: 'Owner',
      display_name: 'Owner',
      ref: null,
    },
    'ba461f36-db48-4a1d-9dd5-d14e6bece7bb': {
      value: { value: 0, units: 'Hours' },
      type: 'Quantity',
      name: 'TaskEstimateTotal',
      display_name: 'Task Estimate Total',
      ref: null,
    },
    'aad205e0-2fbe-11e4-8c21-0800200c9a66': {
      value: {
        name: 'Defined',
        ref: 'https://rally1.rallydev.com/slm/webservice/v2.x//202de96c-084b-467d-ae3d-5ec17d888ea4',
        detail_link: null,
        id: '202de96c-084b-467d-ae3d-5ec17d888ea4',
        order_index: 1,
        object_type: 'State',
      },
      type: 'State',
      name: 'ScheduleState',
      display_name: 'Schedule State',
      ref: null,
    },
  };

  const parsedState = getProps(state);
  // console.log(parsedState);

  test('parse common data', () => {
    expect(Object.keys(parsedState).length).toBe(Object.keys(state).length);
    expect(parsedState.DisplayColor.displayName).toBe('Display Color');
    expect(parsedState.Name.value).toBe('Browse safari');
    expect(parsedState.Ready.value).toBeFalsy();

    const id = Object.keys(state)[0];
    const { name } = state[id];
    expect(parsedState[name].id).toBe(id);
  });

  test('parse empty value', () => {
    expect(parsedState.Owner.value).toBeNull();
  });

  test('parse nested value', () => {
    expect(parsedState.ScheduleState.value).toBe('Defined');
    expect(parsedState.TaskEstimateTotal.value).toBe(0);
  });

  test('parse corner cases', () => {
    expect(Object.keys(getProps({})).length).toBe(0);

    const testState = {
      'some-id': {},
    };
    const parsedTestState = getProps(testState);
    const id = Object.keys(parsedTestState)[0];
    expect(parsedTestState[id]).not.toBeUndefined();
    expect(parsedTestState[id].displayName).toBe(id);
    expect(parsedTestState[id].value).toBeNull();
  });
});

describe('testing getChanges', () => {
  const changes = {
    'f5b1fb22-6c15-44b5-a592-19189fafe5f2': {
      value: 10,
      old_value: 9,
      added: null,
      removed: null,
      type: 'Integer',
      name: 'VersionId',
      display_name: 'VersionId',
      ref: null,
    },
    '500a0d67-9c48-4145-920c-821033e4a832': {
      value: 'Browse safarii',
      old_value: 'Browse safariii',
      added: null,
      removed: null,
      type: 'String',
      name: 'Name',
      display_name: 'Name',
      ref: null,
    },
    'aad205e0-2fbe-11e4-8c21-0800200c9a66': {
      value: {
        name: 'Defined',
        ref: 'https://rally1.rallydev.com/slm/webservice/v2.x//202de96c-084b-467d-ae3d-5ec17d888ea4',
        detail_link: null,
        id: '202de96c-084b-467d-ae3d-5ec17d888ea4',
        order_index: 1,
        object_type: 'State',
      },

      old_value: {
        name: 'Completed',
        ref: 'https://rally1.rallydev.com/slm/webservice/v2.x//b61c41d3-883f-4bbf-89a4-00cea7869d41',
        detail_link: null,
        id: 'b61c41d3-883f-4bbf-89a4-00cea7869d41',
        order_index: 3,
        object_type: 'State',
      },
      added: null,
      removed: null,
      type: 'State',
      name: 'ScheduleState',
      display_name: 'Schedule State',
      ref: null,
    },
    '81b28a2e-583a-4907-8e99-0a9f86c0fd7a': {
      value: null,
      old_value: {
        formatted_id: 'F1',
        name: 'New Feature',
        ref: 'https://rally1.rallydev.com/slm/webservice/v2.x/portfolioitem/feature/1f8b6386-1e2c-4903-a6a0-9ea137cdc808',
        detail_link: 'https://rally1.rallydev.com/slm/#/detail/portfolioitem/feature/191261153624',
        id: '1f8b6386-1e2c-4903-a6a0-9ea137cdc808',
        object_type: 'Feature',
      },
      added: null,
      removed: null,
      type: 'Feature',
      name: 'PortfolioItem',
      display_name: 'Portfolio Item',
      ref: null,
    },
    '6776da91-9729-42c7-bab1-395b596013f2': {
      value: null,
      old_value: null,
      added: [
        {
          name: 'tag2',
          ref: 'https://rally1.rallydev.com/slm/webservice/v2.x/tag/a8879950-a381-42cf-b714-4dff56333272',
          detail_link: null,
          id: 'a8879950-a381-42cf-b714-4dff56333272',
          object_type: 'Tag',
        },
        {
          name: 'tag3',
          ref: 'https://rally1.rallydev.com/slm/webservice/v2.x/tag/33e0f399-d780-4518-af57-10348dd4082a',
          detail_link: null,
          id: '33e0f399-d780-4518-af57-10348dd4082a',
          object_type: 'Tag',
        },
      ],
      removed: [
        {
          name: 'tag1',
          ref: 'https://rally1.rallydev.com/slm/webservice/v2.x/tag/dcfd7592-29e5-4eca-b7df-22dd34481558',
          detail_link: null,
          id: 'dcfd7592-29e5-4eca-b7df-22dd34481558',
          object_type: 'Tag',
        },
      ],
      type: 'Collection',
      name: 'Tags',
      display_name: 'Tags',
      ref: 'https://rally1.rallydev.com/slm/webservice/v2.x/HierarchicalRequirement/190534510440/Tags',
    },
  };
  const parsedChanges = getChanges(changes);
  // console.log(parsedChanges);

  test('parse common changes', () => {
    expect(Object.keys(parsedChanges).length).toBe(Object.keys(changes).length);
    expect(parsedChanges.Tags.messages.length).toBe(2);
    expect(parsedChanges.VersionId.messages.length).toBe(1);

    expect(parsedChanges.PortfolioItem.messages[0].indexOf('removed')).toBeGreaterThan(-1);
    expect(parsedChanges.ScheduleState.messages[0].indexOf('somerandomstring')).toBe(-1);
    expect(parsedChanges.Name.messages[0].indexOf('changed')).toBeGreaterThan(-1);
  });
});
