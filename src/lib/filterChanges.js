export default (parsedChanges, attributes) =>
  attributes.reduce((acc, attr) => {
    if (parsedChanges[attr]) {
      acc.push(...parsedChanges[attr].messages);
    }
    return acc;
  }, []);
