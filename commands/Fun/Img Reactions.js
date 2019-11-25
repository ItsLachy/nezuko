const { readdir } = require('fs')
const Command = require('../../core/Command')

class ImgReactions extends Command {
  constructor(client) {
    super(client, {
      name: 'img',
      category: 'Fun',
      description: 'Gif image reactions',
      usage: `img list | img wow`,
      guildOnly: true,
      args: true
    })
  }

  async run(client, msg, args, api) {
    //* -------------------------- Setup --------------------------
    const { Utils } = client
    const { author, channel } = msg
    if (!api) msg.delete()

    //* ------------------------- Config --------------------------

    const imgDir = 'data/images/reactions'

    //* ----------------------- Main Logic ------------------------

    const listImages = async () => {
      const files = await readdir(imgDir)
      const fileList = []
      if (files) {
        files.forEach((file) => {
          const baseName = file.split('.').shift()
          fileList.push(baseName)
        })
        return fileList
      }
      return false
    }

    const findImage = async (searchTerm) => {
      const files = await readdir(imgDir)
      if (files)
        files.forEach((file) => {
          const ext = file.split('.').pop()
          const baseName = file.split('.').shift()

          if (baseName === searchTerm) return [`${imgDir}/${baseName}.${ext}`, file]
        })

      return false
    }

    //* ---------------------- Usage Logic ------------------------

    const embed = Utils.embed(msg)

    switch (args[0]) {
      case 'list': {
        const images = await listImages()
        let fileList = ''

        images.forEach((file) => (fileList += `${file}\n`))

        embed.setTitle('Reaction Images')
        embed.addField('Here are my images', fileList)
        const m = await channel.send({ embed })
        return m.delete(10000)
      }

      default: {
        const file = await findImage(args[0])
        if (file) {
          embed.setTitle(`${author.username} said ${args[0]}`)
          embed.attachFile(file[0])
          embed.setImage(`attachment://${file[1]}`)
          return channel.send({ embed })
        }
        embed.setTitle(`No reactions for ${args[0]}`)
        const m = await channel.send({ embed })
        return m.delete(10000)
      }
    }
  }
}
module.exports = ImgReactions
