const { createEmbed } = require('../../utils/embed');

module.exports.run = async ({ message }) => {
	const diceOne = Math.ceil(Math.random() * 6);
	const diceTwo = Math.ceil(Math.random() * 6);

	return message.channel.send(
		createEmbed({
			author: {
				username: 'Rolling the dice...',
				avatarURL:
					'https://images-ext-2.discordapp.net/external/4I6u8ZC4y6o6cNUfQI3BsrHBpFVWu8Rx2hbi3dzSuCo/https/cdn.discordapp.com/emojis/793182482639224843.png',
			},
			body: `The first die has landed on... **${diceOne}**, the other die has landed on... **${diceTwo}**! \nThe dice have rolled to a total of... **${
				diceOne + diceTwo
			}**!`,
		}),
	);
};

module.exports.config = {
	name: 'roll-dice',
	aliases: ['roll', 'roll-die'],
};
