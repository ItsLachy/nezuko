const Command = require('../../core/Command')
const config = require('../../data/config')
const { prefix } = config.general

class Routines extends Command {
  constructor(client) {
    super(client, {
      name: 'routine',
      category: 'Smart Home',
      description: 'Routines like good morning or goodnight',
      usage: `${prefix}routine morning | ${prefix}routine sleep`,
      aliases: [],
      args: false,
      disabled: false,
      ownerOnly: true,
      guildOnly: true,
      webUI: false
    })
  }

  async run(msg, args, api) {
    const logger = this.client.logger

    const routine = args[0]
    // command setup
    let commands
    switch (routine) {
      case 'on':
        commands = [
          ['say', 'Routine on activated'],
          ['avr', 'on'],
          ['pc', 'gaara on'],
          ['pc', 'thinkboi on'],
          ['lamp', ' desk on']
        ]
        break
      case 'off':
        commands = [
          ['say', 'Routine off activated'],
          ['avr', 'off'],
          ['pc', 'gaara off'],
          ['pc', 'thinkboi off'],
          ['lamp', ' desk off']
        ]
        break
      default:
        return
    }
    // .setFooter(`Requested by: ${msg.author.username}`, msg.author.avatarURL)
    try {
      for (const item of commands) {
        const params = item[1].trim().split(' ')
        const cmd =
          client.commands.get(item[0]) ||
          client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(item[0]))
        try {
          if (api) {
            await cmd.execute(client, msg, params, 'expressAPI')
          }
          await cmd.execute(client, msg, params, api)
        } catch {
          console.log(`${item[0]} ${params}`)
        }
      }
      return 'success'
    } catch (error) {
      logger.warn(error)
      return 'failure'
    }
  }
}
module.exports = Routines