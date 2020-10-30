const { MessageEmbed } = require('discord.js');
const config = require('../config/config.js');

async function getHelpList(params) {
  var out = [];
  await params.forEach((p) => {
    var cmd = require(`./${p}.js`);
    out.push(`${cmd.name} ${cmd.usage}`);
  })

  return out.join('\n');
}

module.exports = {
  name: 'help',
  description: 'List of commands',
  aliases: ['commands', 'ajuda'],
  usage: '[command]',
  cooldown: 5,
  guildOnly: false,
  permission: '*',
}

module.exports.execute = async (client, message, args) => {
  console.log(args);
  if (!args[0]) {
    await message.channel.send('**<a:loading:755513577850273822> Fetching commands...**').then(async (m) => {
      const embed = new MessageEmbed()
        .setTitle('Commands')
        .setDescription(`Use the commands with prefix, e.g. \`${config.prefix}help\`.\nUse \`${config.prefix}help <command>\` for more info.`)
        .addField('Economy', await getHelpList(['balance', 'work', 'transfer']))
        .setColor(config.color)
        .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
        .setFooter(message.author.tag + ' | <required> [optional]', message.author.displayAvatarURL({ dynamic: true }));

      message.author.send(embed);
      m.edit('**<:mail:755511064111611925> See your DMs!**');
    })
  } else {
    const info = client.commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));
    if (!info) return message.channel.send(
      new MessageEmbed()
        .setDescription(`The \`${args[0]}\` command was not found, try using \`${config.prefix}help\``)
        .setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
        .setColor('RED')
    );

    const embedInfo = new MessageEmbed()
      .setTitle(config.prefix + info.name)
      .addField('Usage', config.prefix + info.name + " " + info.usage)
      .addField('Description', info.description)
      .addField('Need permission', info.permission)
      .addField('Aliases', info.aliases.join(', '))
      .setColor(config.color)
      .setFooter(message.author.tag + ' | <required> [optional]', message.author.displayAvatarURL({ dynamic: true }))

    message.channel.send(embedInfo);
  }
}
