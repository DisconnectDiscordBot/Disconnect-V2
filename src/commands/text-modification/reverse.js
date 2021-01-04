const { createEmbed } = require('../../utils/embed');

module.exports.run = async ({ message, args }) => {
	const body = args[0]
		? args.join(' ').split('').reverse().join('')
		: 'Please provide some text you would like to be reversed.'
				.split('')
				.reverse()
				.join('');

	return message.channel.send(createEmbed({ body }));
};

module.exports.config = {
	name: 'reverse',
	aliases: ['reverse-text'],
};
