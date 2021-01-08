const { createEmbed, improperUsage } = require('../../utils/embed');
const agent = require('superagent');

module.exports.run = async ({ message, args }) => {
	const text = args[0] ? args.join(' ') : 'Not giving text!';
	if (text.length > 25) {
		return message.channel.send('Text must be under 25 characters.');
	}

	const { body } = await agent
		.get('https://www.minecraftskinstealer.com/achievement/a.php')
		.query({
			i: Math.floor(Math.random() * 39),
			h: 'Achievement Get!',
			t: text,
		});

	return message.channel.send({
		files: [{ attachment: body, name: 'achievement.png' }],
	});
};

module.exports.config = {
	name: 'achievement',
	aliases: ['minecraft', 'mc', 'minecraft-achievement'],
};
