const agent = require('superagent');
const { createEmbed } = require('../../utils/embed');
const subReddits = [
	'meme',
	'animemes',
	'MemesOfAnime',
	'animememes',
	'AnimeFunny',
	'dankmemes',
	'dankmeme',
	'wholesomememes',
	'MemeEconomy',
	'techsupportanimals',
	'meirl',
	'me_irl',
	'2meirl4meirl',
	'AdviceAnimals',
];

async function getFromReddit() {
	const reddit = subReddits[Math.floor(Math.random() * subReddits.length)];

	const { body } = await agent
		.get(`https://www.reddit.com/r/${reddit}.json?sort=top&t=week`)
		.query({ limit: 800 });

	const post =
		body.data.children[
			Math.floor(Math.random() * body.data.children.length)
		];

	if (
		(!post.data.url.endsWith('.png') &&
			!post.data.url.endsWith('.jpg') &&
			!post.data.url.endsWith('.jpeg')) ||
		post.is_video
	) {
		return await getFromReddit();
	} else {
		return post;
	}
}

module.exports.run = async ({ message }) => {
	const result = await getFromReddit();

	const title = result.data.title;
	const image = result.data.url;

	return message.channel.send(
		createEmbed({
			title,
			image,
			footer: `Subreddit: ${result.data.subreddit_name_prefixed}`,
		}),
	);
};

module.exports.config = {
	name: 'meme',
	aliases: ['random-meme'],
};
