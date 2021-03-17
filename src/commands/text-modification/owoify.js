const { createEmbed } = require('../../utils/embed');

function owoify(text) {
	const faces = ['(・`ω´・)', ';;w;;', 'owo', 'UwU', '>w<', '^w^'];

	text = text.replace(/(?:r|l)/g, 'w');
	text = text.replace(/(?:R|L)/g, 'W');
	text = text.replace(/n([aeiou])/g, 'ny$1');
	text = text.replace(/N([aeiou])/g, 'Ny$1');
	text = text.replace(/N([AEIOU])/g, 'Ny$1');
	text = text.replace(/ove/g, 'uv');
	text = text.replace(
		/!+/g,
		' ' + faces[Math.floor(Math.random() * faces.length)] + ' ',
	);

	return text;
}

module.exports.run = async ({ message, args }) => {
	const body = args[0]
		? owoify(args.join(' '))
		: owoify('Please provide some text you would like to be owoified.');

	return message.channel.send(createEmbed({ body }));
};

module.exports.config = {
	name: 'owoify',
	aliases: ['owoify-text'],
};
