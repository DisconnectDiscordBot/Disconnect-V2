const { MessageEmbed } = require('discord.js');
const { success, error } = require('../../../assets/colors.json');
const roulette = [
	':gun: Pow! You are dead, try again?',
	':gun: No bullet so ***you survived***! Would you like to try again?',
	':gun: No bullet so ***you survived***! Would you like to try again?',
	':gun: No bullet so ***you survived***! Would you like to try again?',
	':gun: it Jammed! Did you get lucky? (Try Again)',
];

module.exports.run = async ({ message }) => {
	const result = roulette[Math.floor(Math.random() * roulette.length)];

	const e = new MessageEmbed()
		.setTitle('Spinning the Chamber...')
		.setDescription(result)
		.setColor(result.includes('You are dead') ? error : success);
	return message.channel.send(e);
};

module.exports.config = {
	name: 'russian-roulette',
};
