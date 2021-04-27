const { Collection, MessageEmbed } = require('discord.js');
const fs = require('fs');
const { prefix, color, imagecfg, defaultCooldown } = require('./src/config/config.js');
const { discordToken } = require('./src/config/tokens.js');
const Client = require('./src/config/Client.js');
const Utils = require('./src/Utils.js');
const db = require('./src/database')();

const client = new Client();
const cooldowns = new Collection();

const commandFiles = fs
  .readdirSync('./src/commands')
  .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./src/commands/${file}`);
  client.commands.set(command.name, command);
  console.log(`[+] Loaded ${command.name}`);
};

client.db = db;

client.once('ready', () => {
  Utils.logger.success(`Discord instance ready in user ${client.user.tag} (${client.user.id})`);
/*
  client.user.setPresence({
    status: 'dnd',
    activity: {
      name: 'ser o magnata',
      type: 'COMPETING'
    }
  }).catch(console.error);
*/
});

client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  Utils.logger.debug(`${message.author.tag}: ${message.content}`);

  if (!command) {
    let embed = new MessageEmbed()
      .setTitle('This commands does not exist!')
      .setDescription(`Try using \`${prefix}help\``)
      .setColor(color)
      .setFooter(message.author.tag, message.author.displayAvatarURL(imagecfg));

    return message.channel.send(embed);
  };

  if (command.guildOnly && message.channel.type === 'dm')
    return message.reply('**<:error:755511540320436385> Use commands in guild channel!**');

  if(!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || defaultCooldown || 3) * 1000;

  if(timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if(now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`**<:error:755511540320436385> Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${prefix}${command.name}\` command.**`)
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(client, message, args);
  } catch (error) {
    console.log(error);
    message.reply('**<:error:755511540320436385> Error, try again later.**');
  };
});

client.login(discordToken).catch(console.error);