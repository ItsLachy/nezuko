const { client } = require('../index')
const apiServer = require('../core/subprocesses/webServer/index')
const scheduledTasks = require('../core/subprocesses/scheduledTaks')
const chalk = require('chalk')

client.on('ready', async () => {
  const { logger } = client
  const { username } = client.config.general
  // log that bot is ready
  logger.info(chalk.green(`${chalk.yellow(client.user.username)}'s lazers ready to fire.`))

  // set bot username
  if (client.user.username !== username) {
    client.user.setUsername(username)
    logger.info(chalk.white(`Username changed to ${chalk.yellow(username)}`))
  }

  // set bot activity status
  client.user.setActivity('my codebase burn. ;)', {
    type: 'watching'
  })

  // start API server
  if (client.config.general.apiEnabled) {
    await apiServer(client)
  }

  // start scheduled tasks
  await scheduledTasks(client)
})