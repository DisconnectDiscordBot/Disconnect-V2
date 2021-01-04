const agent = require('superagent');
const { createEmbed } = require('../../utils/embed');

module.exports.run = async ({ message }) => {
	const result = await agent.get('http://api.adviceslip.com/advice');
	const adviceResult = JSON.parse(result.text);

	return message.channel.send(
		createEmbed({
			body: adviceResult.slip.advice,
			footer: `Advice Slip #${adviceResult.slip.id}`,
		}),
	);
};

module.exports.config = {
	name: 'advice',
	aliases: ['random-advice'],
};
