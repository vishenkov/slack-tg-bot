export default changes =>
  Object.keys(changes).reduce((acc, id) => {
    const change = changes[id];
    const obj = {
      id,
      messages: [],
    };
    if (change.value || change.old_value) {
      let status = change.old_value ? 'changed' : 'setted';
      status = change.value ? status : 'removed';
      const message = `*${change.display_name}* ${status}`;
      obj.messages.push(message);
    } else {
      if (change.added) {
        const count = change.added.length;
        const message = `${count} element${count > 1 ? 's' : ''} added to *${change.display_name}*`;
        obj.messages.push(message);
      }
      if (change.removed) {
        const count = change.removed.length;
        const message = `${count} element${count > 1 ? 's' : ''} removed from *${change.display_name}*`;
        obj.messages.push(message);
      }
    }
    if (!obj.messages.length) {
      obj.messages.push('Something was changed');
    }
    acc[change.name || id] = obj;
    return acc;
  }, {});
