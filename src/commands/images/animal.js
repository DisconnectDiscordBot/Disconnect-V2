const agent = require('superagent');
const { createEmbed } = require('../../utils/embed');
const animals = ['panda', 'bird', 'koala'];
const pandas = ['panda', 'red_panda'];

module.exports.run = async ({ message }) => {
	const search = await animals[Math.floor(Math.random() * animals.length)];
	const imageSearch = await (search == 'bird'
		? 'birb'
		: search == 'panda'
		? pandas[Math.floor(Math.random() * pandas.length)]
		: search);

	const imageResult = await agent.get(
		`https://some-random-api.ml/img/${imageSearch}`,
	);
	const factResult = await agent.get(
		`https://some-random-api.ml/facts/${search}`,
	);

	return message.channel.send(
		createEmbed({
			body: factResult.body.fact,
			image: imageResult.body.link,
		}),
	);
};

module.exports.config = {
	name: 'animal',
	aliases: ['random-animal'],
};
