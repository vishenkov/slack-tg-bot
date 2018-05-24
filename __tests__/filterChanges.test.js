import filterChanges from '../src/lib/filterChanges';

const parsedChanges = {
  VersionId:
  {
    id: 'f5b1fb22-6c15-44b5-a592-19189fafe5f2',
    messages: ['*VersionId* changed'],
  },
  Name:
  {
    id: '500a0d67-9c48-4145-920c-821033e4a832',
    messages: ['*Name* changed'],
  },
  ScheduleState:
  {
    id: 'aad205e0-2fbe-11e4-8c21-0800200c9a66',
    messages: ['*Schedule State* changed'],
  },
  PortfolioItem:
  {
    id: '81b28a2e-583a-4907-8e99-0a9f86c0fd7a',
    messages: ['*Portfolio Item* removed'],
  },
  Tags:
  {
    id: '6776da91-9729-42c7-bab1-395b596013f2',
    messages: ['2 elments added to *Tags*', '1 elment removed from *Tags*'],
  },
};


describe('filter parsed changes by config setting', () => {
  test('empty config', () => {
    expect(filterChanges(parsedChanges, []).length).toBe(0);
  });

  test('not matching config', () => {
    expect(filterChanges(parsedChanges, ['SomeParam']).length).toBe(0);
  });

  test('matching config', () => {
    expect(filterChanges(parsedChanges, ['PortfolioItem']).length).toBe(1);
    expect(filterChanges(parsedChanges, ['Tags']).length).toBe(2);
    expect(filterChanges(parsedChanges, ['VersionId', 'Name']).length).toBe(2);
  });

  test('empty parsed changes', () => {
    expect(filterChanges({}, []).length).toBe(0);
    expect(filterChanges({}, ['ScheduleState', 'Name']).length).toBe(0);
  });
});
