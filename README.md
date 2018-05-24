# Rally Bot

> The Rally bot is an application for Slack or Telegram users to quickly receive changes from Rally.

## Usage

> Start localy
```
npm start
```

> Build
```
npm run build
```

> Start on server
```
npm run serve
```

> Tests
```
npm run test
```

## Bot commands

`tasks <story id | defect id>`
> fetch tasks for User Story or Defect
`create task <story id | defect id> <taskname>`
> creates new task with given name
`state <task id | defect id>`
> fetch State for Task or Defect
`scstate <story id | defect id>`
> fetch Schedule State for User Story or Defect
`search <project name | key>`
> search given key in User Story names
`accept <story id | defect id>`
> set Schedule State 'Accepted' for User Story or Defect
`start <story id | defect id | task id>`
> set Schedule State 'In-Progress' for User Story or Defect OR State 'In-Progress' for Task
`complete <story id | defect id | task id>`
> set Schedule State 'Completed' for User Story or Defect OR State 'Completed' for Task
`open <defect id>`
> set State 'Open' for Defect
`fix <defect id>`
> set State 'Fixed' for Defect
`close <defect id>`
> set State 'Close' for Defect
`help`
> show all commands
