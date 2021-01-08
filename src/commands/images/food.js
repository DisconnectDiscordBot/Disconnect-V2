const agent = require('superagent');
const { createEmbed } = require('../../utils/embed');
const foods = ['food', 'coffee'];

module.exports.run = async ({ message }) => {
	const imageResult = await agent
		.get('https://nekobot.xyz/api/image')
		.query({ type: foods[Math.floor(Math.random() * foods.length)] });

	return message.channel.send(
		createEmbed({
			image: imageResult.body.message,
		}),
	);
};

module.exports.config = {
	name: 'food',
	aliases: ['random-food'],
};
