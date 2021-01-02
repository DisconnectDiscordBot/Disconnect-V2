const agent = require('superagent');
const { createEmbed } = require('../../utils/embed');

module.exports.run = async ({ message }) => {
	const res = await agent.get('https://icanhazdadjoke.com/slack');

	const e = await createEmbed({
		title: 'Dad Joke',
		body: res.body.attachments.map((a) => a.text),
	});
	return message.channel.send(e);
};

module.exports.config = {
	name: 'dad-joke',
	aliases: ['dad'],
};
