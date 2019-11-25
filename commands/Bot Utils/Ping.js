const Command = require('../../core/Command')

class Ping extends Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      category: 'Bot Utils',
      description: 'Check discord latency.',
      ownerOnly: true
    })
  }

  async run(client, msg) {
    // * ------------------ Setup --------------------

    const { Utils } = client
    const { standardMessage } = Utils

    // * ------------------ Logic --------------------

    return standardMessage(msg, `Pong! Your ping is ${Date.now() - msg.createdTimestamp} ms`)
  }
}
module.exports = Ping
