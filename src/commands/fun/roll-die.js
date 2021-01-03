const { createEmbed } = require('../../utils/embed');

module.exports.run = async ({ message, args }) => {
	const dice_one = Math.ceil(Math.random() * 6);
	const dice_two = Math.ceil(Math.random() * 6);

	return message.channel.send(
		createEmbed({
			author: {
				username: 'Rolling the dice...',
				avatarURL:
					'https://images-ext-2.discordapp.net/external/4I6u8ZC4y6o6cNUfQI3BsrHBpFVWu8Rx2hbi3dzSuCo/https/cdn.discordapp.com/emojis/793182482639224843.png',
			},
			body: `The first die has landed on... **${dice_one}**, the other die has landed on... **${dice_two}**! \nThe dice have rolled to a total of... **${
				dice_one + dice_two
			}**!`,
		}),
	);
};

module.exports.config = {
	name: 'roll-dice',
	aliases: ['roll', 'roll-die'],
};
