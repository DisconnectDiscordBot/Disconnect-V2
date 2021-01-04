const { createEmbed } = require('../../utils/embed');
const agent = require('superagent');

module.exports.run = async ({ message, args }) => {
	const speech = args[0]
		? args.join(' ')
		: 'Please provide text you would like me to fix.';

	const { text } = await agent.get(
		`http://yoda-api.appspot.com/api/v1/yodish?text=${encodeURIComponent(
			speech.toLowerCase(),
		)}`,
	);

	return message.channel.send(createEmbed({ body: JSON.parse(text).yodish }));
};

module.exports.config = {
	name: 'yodish',
	aliases: ['yoda', 'yodaish'],
};
