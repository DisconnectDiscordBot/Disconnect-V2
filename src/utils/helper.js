const agent = require('superagent');
const { createEmbed } = require('./embed');

/*
    Command Helper
    This is a group of command helpers to remove duplicate code
*/

// GET Some Random API endpoint and send
module.exports.sendSomeRandomAnimalAPI = async (message, animal, query) => {
	const imageResult = await agent.get(
		`https://some-random-api.ml/img/${query ? query : animal}`,
	);
	const factResult = await agent.get(
		`https://some-random-api.ml/facts/${animal}`,
	);

	return message.channel.send(
		createEmbed({
			body: factResult.body.fact,
			image: imageResult.body.link,
		}),
	);
};

// GET nekos.life API endpoint and send
module.exports.sendNekosAPI = async (message, query) => {
	const imageResult = await agent
		.get('https://nekobot.xyz/api/image')
		.query({ type: query });

	return message.channel.send(
		createEmbed({
			image: imageResult.body.message,
		}),
	);
};
