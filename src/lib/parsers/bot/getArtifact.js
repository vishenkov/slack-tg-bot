export default (type, num) => {
  switch (type) {
    case 'US':
      return {
        type: 'UserStory',
        id: `${type}${num}`,
      };
    case 'DE':
      return {
        type: 'Defect',
        id: `${type}${num}`,
      };
    case 'TA':
      return {
        type: 'Task',
        id: `${type}${num}`,
      };
    default:
      throw new Error(`Not able to parse Artifact type: ${type}. Valid types are: [US for User Story, DE for Defect, TA for Task]`);
  }
};
