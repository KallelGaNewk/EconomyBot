const c = require('chalk');
const { MessageEmbed } = require('discord.js');
const config = require('../config/config.js');

module.exports.logger = {
    debug(text) {
        console.log(` ${c.white('DEBUG')} ${c.gray('|')} ${c.white(text)}`);
    },
    success(text) {
        console.log(` ${c.green('SUCCESS')} ${c.gray('|')} ${c.white(text)}`);
    },
    info(text) {
        console.log(` ${c.blue('INFO')} ${c.gray('|')} ${c.white(text)}`);
    },
    warning(text) {
        console.log(` ${c.yellow('WARNING')} ${c.gray('|')} ${c.white(text)}`);
    },
    error(text) {
        console.log(` ${c.red('ERROR')} ${c.gray('|')} ${c.white(text)}`);
    }
}

module.exports.randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports.createDefaultEmbed = (message, text) => {
    let embed = new MessageEmbed()
    .setDescription(text).setColor(config.color)
    .setFooter(message.author.tag, message.author.displayAvatarURL(config.imagecfg));

    return message.channel.send(embed);
}

