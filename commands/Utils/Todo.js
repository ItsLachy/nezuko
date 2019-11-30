const Command = require('../../core/Command')

module.exports = class Todo extends Command {
  constructor(client) {
    super(client, {
      name: 'todos',
      aliases: ['todo'],
      category: 'Utils',
      description: 'Your personal todo list'
    })
  }

  async run(client, msg, args) {
    const { p, Utils, memberConfig } = client
    const { standardMessage, embed, asyncForEach, warningMessage } = Utils
    const { author } = msg

    const todo = args.slice(1).join(' ')

    const db = await memberConfig.findOne({ where: { id: author.id } })
    const config = JSON.parse(db.dataValues.config)
    const { todos } = config

    switch (args[0]) {
      case 'add': {
        if (todos.length >= 10) {
          return warningMessage(msg, 'You cannot have more than [ 10 ] todos!')
        }

        if (!todo) {
          const m = await warningMessage(msg, 'Todo cannot be empty!')
          return m.delete(3000)
        }

        todos.push(todo)
        await db.update({ config: JSON.stringify(config) })
        return standardMessage(msg, `Added [ ${todo} ] to todo list`)
      }

      default: {
        if (!todos.length) {
          return msg.reply(
            embed(msg, 'yellow')
              .setTitle(`Todo list is empty!`)
              .setDescription(`\`${p}todos add <todo to add>\` to add one`)
          )
        }

        const reactions = [
          '\u0031\u20E3',
          '\u0032\u20E3',
          '\u0033\u20E3',
          '\u0034\u20E3',
          '\u0035\u20E3',
          '\u0036\u20E3',
          '\u0037\u20E3',
          '\u0038\u20E3',
          '\u0039\u20E3',
          '🔟'
        ]
        // setup inital embed
        const e = embed(msg).setTitle('Todo List')
        todos.forEach((i, index) => e.addField(`[ ${index + 1} ]`, `${i}`, true))
        const m = await msg.reply(e)

        await asyncForEach(todos, async (i, index) => {
          await m.react(reactions[index])
        })
        await m.react('🛑')

        // setup reaction collector
        const filter = (reaction, user) => {
          const { name } = reaction.emoji
          if (reactions.includes(name) && user.id === author.id) return true
          if (name === '🛑' && user.id === author.id) return true
        }
        const collector = m.createReactionCollector(filter, { max: 11, time: 3600000 })

        collector.on('collect', async (a) => {
          if (a.emoji.name === '🛑') return m.clearReactions()

          // find index
          const index = reactions.findIndex((i) => i === a.emoji.name)

          // remove and notify todo is removed
          const name = todos[index]
          todos.splice(index, 1)
          await db.update({ config: JSON.stringify(config) })
          const removeMessage = await standardMessage(msg, `[ ${name} ] removed from todo list`)
          removeMessage.delete(2000)

          // edit original embed with updated content
          await m.clearReactions()
          if (!todos.length) {
            return m.edit(
              embed(msg, 'yellow')
                .setTitle(`There are no more todos!`)
                .setDescription(`\`${p}todos add <todo to add>\` to add one`)
            )
          }
          const newEmbed = embed(msg).setTitle('Todo List')
          todos.forEach((i, ind) => newEmbed.addField(`[ ${ind + 1} ]`, `${i}`, true))
          await m.edit(newEmbed)
          await asyncForEach(todos, async (i, ind) => {
            await m.react(reactions[ind])
          })
          await m.react('🛑')
        })
      }
    }
  }
}
