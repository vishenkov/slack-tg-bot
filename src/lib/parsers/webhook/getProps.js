import _ from 'lodash';

export default state =>
  Object.keys(state).reduce((acc, id) => {
    const name = state[id].name || id;
    // console.log(id, name);
    const displayName = state[id].display_name || id;
    let value = _.get(state[id], 'value', null);
    // console.log(displayName, value, state[id]);
    if (value) {
      value = typeof value === 'string'
        ? value
        : value.name || value.value;
    }
    const obj = {
      id,
      displayName,
      value,
    };
    acc[name] = obj;
    return acc;
  }, {});

