const { MessageEmbed } = require('discord.js');
const { success, error } = require('../../../assets/colors.json');
const symbols = ['🍎', '🍌', '🍒', '🍓', '🍈'];

module.exports.run = async ({ message }) => {
	const results = [
		symbols[Math.floor(Math.random() * symbols.length)],
		symbols[Math.floor(Math.random() * symbols.length)],
		symbols[Math.floor(Math.random() * symbols.length)],
	];

	const e = new MessageEmbed().setAuthor('🎰 Slots');

	if (results[0] == results[1] && results[0] == results[2]) {
		e.setDescription(
			`${message.member} is trying their luck at the slot machine. \n\n${results[0]} ${results[1]} ${results[2]} \n\n AND... THEY HAVE WON!!!  🎉🎉`,
		);
		e.setColor(success);
	} else {
		e.setDescription(
			`${message.member} is trying their luck at the slot machine. \n\n${results[0]} ${results[1]} ${results[2]} \n\n AND... they have lost!`,
		);
		e.setColor(error);
	}

	return message.channel.send(e);
};

module.exports.config = {
	name: 'slots',
};
