const agent = require('superagent');
const { createEmbed } = require('../../utils/embed');

module.exports.run = async ({ message }) => {
	const res = await agent
		.get('https://www.reddit.com/r/Showerthoughts.json')
		.query({ limit: 1000 });

	const approvedResults = message.channel.nsfw
		? res.body.data.children
		: res.body.data.children.filter((post) => !post.data.over_18);

	const thought =
		approvedResults.length > 0
			? approvedResults[
					Math.floor(Math.random() * approvedResults.length)
			  ].data.title
			: 'I can not think of any shower thoughts right now. But what about dad jokes?';

	return message.channel.send(
		createEmbed({
			title: 'Shower Thought',
			body: thought,
		}),
	);
};

module.exports.config = {
	name: 'shower-thought',
	aliases: ['shower'],
};
