"use strict";
/*!
 * Coded by CallMeKory - https://github.com/callmekory
 * 'It’s not a bug – it’s an undocumented feature.'
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_worker_1 = __importDefault(require("core-worker"));
const moment_1 = require("moment");
const Command_1 = require("../../core/Command");
Promise.resolve().then(() => __importStar(require('moment-duration-format')));
class Reload extends Command_1.Command {
    constructor(client) {
        super(client, {
            name: 'bot',
            category: 'Owner',
            description: 'Bot Commands',
            ownerOnly: true,
            usage: [
                'bot reload <command>',
                'bot restart',
                'bot avatar <new avatar url>',
                'bot status <new status>',
                'bot name <new name>'
            ]
        });
    }
    async run(client, msg, args) {
        // * ------------------ Setup --------------------
        const { user } = client;
        const { warningMessage, standardMessage, embed } = client.Utils;
        const { context, channel } = msg;
        const { round } = Math;
        const { memoryUsage } = process;
        const option = args[0];
        args.shift();
        // * ------------------ Logic --------------------
        switch (option) {
            case 'reload': {
                const module = args[1];
                if (!module) {
                    const msg1 = (await standardMessage(msg, `Reloading all modules..`));
                    await context.reloadCommands();
                    return msg1.edit(standardMessage(msg, `Reloading all modules.. done!`));
                }
                const run = await context.reloadCommand(module);
                if (run)
                    return warningMessage(msg, `Reloaded ${module}`);
                return warningMessage(msg, `Module [ ${module} ] doesn't exist!`);
            }
            case 'restart': {
                let count = 10;
                const m = (await channel.send(embed('yellow').setDescription(`Restarting in ${count} seconds..`)));
                const interval = setInterval(async () => {
                    if (count === 0) {
                        await m.edit(embed('yellow').setDescription(`Restarting..`));
                        clearInterval(interval);
                        return process.exit();
                    }
                    count--;
                    await m.edit(embed('yellow').setDescription(`Restarting in ${count} seconds..`));
                }, 1000);
                break;
            }
            case 'avatar': {
                await client.user.setAvatar(args[0]);
                return standardMessage(msg, `[ ${client.user.username} ] avatar updated`);
            }
            case 'status': {
                const gameName = args.join(' ');
                await client.user.setActivity(gameName);
                return standardMessage(msg, `[ ${client.user.username} ] status set to [ ${gameName} ]`);
            }
            case 'name': {
                const username = args.join(' ');
                const u = await client.user.setUsername(username);
                return standardMessage(msg, `[ ${client.user.username} ] name changed to [ ${u.username} ]`);
            }
            case 'info': {
                const npmv = await core_worker_1.default.process('npm -v').death();
                return channel.send(embed('green')
                    .setTitle(`Nezuko Status`)
                    .setThumbnail(user.avatarURL)
                    .addField('Uptime', moment_1.duration(client.uptime).format('d[d] h[h] m[m] s[s]'), true)
                    .addField('Memory Usage', `${round(memoryUsage().heapUsed / 1024 / 1024)} MB`, true)
                    .addField('Node Version', process.version.replace('v', ''), true)
                    .addField('NPM Version', npmv.data.replace('\n', ''), true)
                    .addField('Commands', context.commands.size, true)
                    .setDescription(`Nezuko! Created to automate my life [GITHUB](https://github.com/callmekory/nezuko)`));
            }
        }
    }
}
exports.default = Reload;
