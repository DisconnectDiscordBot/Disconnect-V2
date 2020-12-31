const { createEmbed } = require('../../utils/embed');

module.exports.run = async ({ message, args }) => {
	const e = await createEmbed({
		author: {
			username: 'Flipping Coin...',
			avatarURL:
				'https://images-ext-2.discordapp.net/external/-Uso5WRQ9U7AAfaQWXNdBTdz_5mwF9_Pdjt8tBFYTsc/https/cdn.discordapp.com/emojis/793177890861613146.png',
		},
		body: `The coin has landed on... **${
			Math.floor(Math.random() * 100) == 76
				? "ON IT'S SIDE?!?"
				: Math.floor(Math.random() * 2) == 1
				? 'HEADS'
				: 'TAILS'
		}**!`,
	});
	return message.channel.send(e);
};

module.exports.config = {
	name: 'coin-flip',
	aliases: ['flip-coin'],
};
