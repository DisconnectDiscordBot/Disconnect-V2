const { flipText } = require('../../utils/translate');
const { createEmbed, improperUsage } = require('../../utils/embed');

module.exports.run = async ({ message, args }) => {
	if (!args[0]) {
		return message.channel.send(
			improperUsage('Please provide text you would like to flip.'),
		);
	} else {
		return message.channel.send(
			createEmbed({
				title: 'I have flipped the text...',
				body: await flipText(args.join(' ')),
			}),
		);
	}
};

module.exports.config = {
	name: 'flip-text',
};
