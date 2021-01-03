const agent = require('superagent');
const { createEmbed } = require('../../utils/embed');
const type = ['boobs', 'ass', 'pussy', 'gonewild'];

module.exports.run = async ({ message, guildData, userData }) => {
	const imageResult = await agent
		.get('https://nekobot.xyz/api/image')
		.query({ type: type[Math.floor(Math.random() * type.length)] });

	message.channel.send(
		createEmbed({
			image: imageResult.body.message,
		}),
	);

	if (guildData.tips && !guildData.premium && !userData.premium) {
		Math.floor(Math.random() * 25) == 9
			? message.channel.send(
					'Want less randomness or kinkier stuff? Donators get access to many categories of their choosing.',
			  )
			: null;
	}
};

module.exports.config = {
	isNSFW: true,
	name: 'porn',
	aliases: ['random-porn'],
};
