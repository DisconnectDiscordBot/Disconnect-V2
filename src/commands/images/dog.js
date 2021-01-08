const agent = require('superagent');
const { createEmbed } = require('../../utils/embed');

module.exports.run = async ({ message }) => {
	const imageResult = await agent.get('https://some-random-api.ml/img/dog');
	const factResult = await agent.get('https://some-random-api.ml/facts/dog');

	return message.channel.send(
		createEmbed({
			body: factResult.body.fact,
			image: imageResult.body.link,
		}),
	);
};

module.exports.config = {
	name: 'dog',
	aliases: ['dog-image', 'dog-fact'],
};
