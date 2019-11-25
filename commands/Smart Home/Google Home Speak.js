const { Device } = require('google-home-notify-client')
const Command = require('../../core/Command')

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
    // * ------------------ Setup --------------------

    const { p, Utils } = client
    const { errorMessage, missingConfig, standardMessage } = Utils

    // * ------------------ Config --------------------

    const { ip, name, language } = JSON.parse(client.db.general.googleHome)

    // * ------------------ Check Config --------------------

    if (!ip || !name || !language) {
      const settings = [
        `${p}db set googleHome name <name>`,
        `${p}db set googleHome ip <ip addy>`,
        `${p}db set googleHome language <en/fr>`
      ]
      return missingConfig(msg, 'googleHome', settings)
    }

    // * ------------------ Logic --------------------

    const googleSpeak = async (speach) => {
      try {
        const device = new Device(ip, name, language)
        await device.notify(speach)
        if (api) return `Told Google Home to say: ${speach}`
        return standardMessage(msg, `Told Google Home to say: ${speach}`)
      } catch {
        if (api) return `No connection to Google Home`
        return errorMessage(msg, `No connection to Google Home`)
      }
    }

    // * ------------------ Usage Logic --------------------

    return googleSpeak(args.join(' '))
  }
}
module.exports = GoogleHomeSpeak
