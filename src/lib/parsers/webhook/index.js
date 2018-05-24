import getProps from './getProps';
import getChanges from './getChanges';

export default ({ state, changes }) => ({
  ...getProps(state),
  changes: getChanges(changes),
});
