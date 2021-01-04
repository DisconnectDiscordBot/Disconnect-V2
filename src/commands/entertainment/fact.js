const agent = require('superagent');
const { createEmbed } = require('../../utils/embed');

module.exports.run = async ({ message }) => {
	const factResult = await agent.get(
		'https://uselessfacts.jsph.pl/random.json?language=en',
	);

	return message.channel.send(
		createEmbed({
			body: factResult.body.text,
		}),
	);
};

module.exports.config = {
	name: 'fact',
	aliases: ['random-fact', 'fun-fact'],
};
