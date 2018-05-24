const standartError = 'Not able to parse given arguments.';

const errors = {
  tasks: `${standartError}\nCommand format: \`tasks <story id | defect id>\``,
  create: `${standartError}\nCommand format: \`create task <story id | defect id> <new task name>\``,
  search: `${standartError}\nCommand format: \`search <project name> ? <keyword>\``,
  accept: `${standartError}\nCommand format: \`accept <story id | defect id>\``,
  complete: `${standartError}\nCommand format: \`complete <story id | defect id | task id>\``,
  start: `${standartError}\nCommand format: \`start <story id | defect id | task id>\``,
  fix: `${standartError}\nCommand format: \`fix <defect id>\``,
  open: `${standartError}\nCommand format: \`open <defect id>\``,
  close: `${standartError}\nCommand format: \`close <defect id>\``,
  state: `${standartError}\nCommand format: \`state <defect id | task id>\``,
  scstate: `${standartError}\nCommand format: \`scstate <story id | defect id>\``,
  unknown: 'Unknown command\nTry `help` to get supported commands',
};

export default command => errors[command] || standartError;
