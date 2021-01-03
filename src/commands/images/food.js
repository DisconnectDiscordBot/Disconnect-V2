const agent = require('superagent');
const { createEmbed } = require('../../utils/embed');
const foods = ['food', 'coffee'];

module.exports.run = async ({ message }) => {
	const imageResult = await agent
		.get('https://nekobot.xyz/api/image')
		.query({ type: foods[Math.floor(Math.random() * foods.length)] });

	const e = await createEmbed({
		image: imageResult.body.message,
	});
	return message.channel.send(e);
};

module.exports.config = {
	name: 'food',
	aliases: ['random-food'],
};
