const { MessageEmbed } = require('discord.js');
const { improperUsage } = require('../../utils/embed');
const { getTwitterUser } = require('../../utils/integrations/twitter');

module.exports.run = async ({ args, message }) => {
	if (!args.length) {
		return message.channel.send(
			improperUsage(
				'Please provide the username of the twitter account you are looking for.',
			),
		);
	}

	// Get Twitter Account
	let results = null;
	try {
		results = await getTwitterUser(args.join(''));
		if (!results || typeof results !== 'object') {
			return message.channel.send(
				improperUsage(
					`I was unable to find a Twitter account named \`${args.join(
						'',
					)}\`. Please make sure you are looking up their Twitter handle not their display name.`,
				),
			);
		}
	} catch (err) {
		return message.channel.send(
			improperUsage(
				`There was an error trying to find the Twitter account named \`${args.join(
					'',
				)}\`. Please make sure you are looking up their Twitter handle not their display name.`,
			),
		);
	}

	// Display Results
	const e = new MessageEmbed()
		.setColor('00ACEE')
		.setTitle(`${results.name} (@${results.screen_name})`)
		.setURL(`https://twitter.com/${results.screen_name}`)
		.setDescription(results.description)
		.addField(
			'Location',
			results.location ? results.location : 'No Location Set',
		)
		.addField('Following', results.friends_count.toLocaleString(), true)
		.addField('Followers', results.followers_count.toLocaleString(), true)
		.addField('_ _', '_ _', true)
		.addField('Tweets', results.statuses_count.toLocaleString(), true)
		.addField('Likes', results.favourites_count.toLocaleString(), true)
		.addField('Lists', results.listed_count.toLocaleString(), true)
		.setFooter(
			`${results.id_str} • Account Created: ${results.created_at
				.split(' ')
				.splice(0, 3)
				.join(' ')} ${results.created_at
				.split(' ')
				.splice(5, 1)
				.join(' ')}`,
		);

	// Set Avatar and Image
	if (results.profile_image_url_https) {
		e.setThumbnail(results.profile_image_url_https);
	}
	if (results.profile_banner_url) {
		e.setImage(results.profile_banner_url);
	}

	return message.channel.send(e);
};

module.exports.config = {
	name: 'twitter',
	aliases: ['twitter-user', 'get-twitter-user'],
};
