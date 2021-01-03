const {
	'eight-ball': responses,
} = require('../../../assets/responses/text.json');
const { createEmbed, improperUsage } = require('../../utils/embed');

module.exports.run = async ({ message, args }) => {
	if (!args[1]) {
		return message.channel.send(
			improperUsage(
				"The magical 8-ball doesn't know how to respond. Please provide it a question you would like answered.",
			),
		);
	} else {
		return message.channel.send(
			createEmbed({
				author: {
					username: 'The 8-ball says...',
					avatarURL:
						'https://images-ext-1.discordapp.net/external/KI1lAF4bXFR4XdGZ0asU2nt5WhpvUGBf2hwIf5wewZo/https/cdn.discordapp.com/emojis/793172531938459648.png',
				},
				body: responses[Math.floor(Math.random() * responses.length)],
			}),
		);
	}
};

module.exports.config = {
	name: '8-ball',
	aliases: ['super-8-ball'],
};
