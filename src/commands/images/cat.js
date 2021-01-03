const agent = require('superagent');
const { createEmbed } = require('../../utils/embed');

module.exports.run = async ({ message }) => {
	const imageResult = await agent.get('https://some-random-api.ml/img/cat');
	const factResult = await agent.get('https://some-random-api.ml/facts/cat');

	const e = await createEmbed({
		body: factResult.body.fact,
		image: imageResult.body.link,
	});
	return message.channel.send(e);
};

module.exports.config = {
	name: 'cat',
	aliases: ['cat-image', 'cat-fact'],
};
