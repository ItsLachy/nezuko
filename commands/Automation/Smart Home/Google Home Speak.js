const { Device } = require('google-home-notify-client')
const Command = require('../../../core/Command')

class GoogleHomeSpeak extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      category: 'Smart Home',
      description: 'Speak through Google Home',
      usage: `say <msg>`,
      aliases: ['speak'],
      ownerOnly: true,
      webUI: true,
      args: true
    })
  }

  async run(client, msg, args, api) {
    // -------------------------- Setup --------------------------
    const { Log, Utils, colors } = client
    const { channel } = msg
    // ------------------------- Config --------------------------

    const { ip, name, language } = JSON.parse(client.settings.googleHome)

    // ----------------------- Main Logic ------------------------

    /**
     * send text to Google Home to TTS
     * @param {String} speach text to have spoken
     * @returns {String} success / no connection
     */
    const googleSpeak = async (speach) => {
      try {
        const device = new Device(ip, name, language)
        await device.notify(speach)
        return 'success'
      } catch (error) {
        Log.warn(error)
        return 'no connection'
      }
    }

    // ---------------------- Usage Logic ------------------------

    const command = args.join(' ')
    const status = await googleSpeak(command)
    const embed = Utils.embed(msg, 'green')

    if (status === 'success') {
      if (api) return `Told Google Home to say: ${command}`
      embed.setTitle(`Told Google Home to say: **${command}**`)
      return channel.send({ embed })
    }
    if (api) return 'No connection to Google Home.'
    embed.setColor(colors.red)
    embed.setTitle('No connection to Google Home.')
    return channel.send({ embed })
  }
}
module.exports = GoogleHomeSpeak
