const agent = require('superagent');
const { promisifyAll } = require('tsubaki');
const { parseStringAsync } = promisifyAll(require('xml2js'));
const { createEmbed, improperUsage } = require('../../utils/embed');

async function getFromReddit() {
	const res = await agent
		.get('https://www.reddit.com/r/rule34.json?sort=top&t=week')
		.query({ limit: 800 });

	if (!res.body.data || !body.data.children) {
		return null;
	}
	if (!res.body.data.children.length) {
		return null;
	}
	
	const post =
		res.body.data.children[
			Math.floor(Math.random() * res.body.data.children.length)
		];

	if (
		!post.data.url.endsWith('.png') &&
		!post.data.url.endsWith('.jpg') &&
		!post.data.url.endsWith('.jpeg')
	) {
		return await getFromReddit();
	} else {
		return post;
	}
}

async function getFromR34(search) {
	const res = await agent.get('https://rule34.xxx/index.php').query({
		page: 'dapi',
		s: 'post',
		q: 'index',
		tags: search,
		limit: 100,
	});

	const results = await parseStringAsync(res.text);
	const posts = results.posts;

	if (posts === '0' || !posts || posts.post.length === '0' || !posts.post.length || !posts.post) {
		return null;
	}

	const post = posts.post[Math.floor(Math.random() * posts.post.length)];

	if (
		!post.$.file_url.endsWith('.png') &&
		!post.$.file_url.endsWith('.jpg') &&
		!post.$.file_url.endsWith('.jpeg')
	) {
		return await getFromR34(search);
	} else {
		return post;
	}
}

module.exports.run = async ({ message, args }) => {
	const search = args.join('_');
	const result =
		args.length < 1 ? await getFromReddit() : await getFromR34(search);

	if (result === null) {
		const res = await getFromReddit();

		if (!res || !res.data) {
			return message.channel.send(
				improperUsage(
					'I was unable to find and images at the moment. Please try again later!',
				),
			);
		}

		const e = await createEmbed({
			title: res.data.title,
			body: `No posts could be found for: ${search}`,
			image: res.data.url,
		});

		return message.channel.send(e);
	}

	const title = args.length < 1 ? result.data.title : `Result from ${search}`;
	const image = args.length < 1 ? result.data.url : result.$.file_url;

	return message.channel.send(
		createEmbed({
			title,
			image,
		}),
	);
};

module.exports.config = {
	isNSFW: true,
	name: 'rule-34',
	aliases: ['r-34'],
};
