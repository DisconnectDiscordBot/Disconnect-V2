const { sendNekosAPI } = require('../../utils/helper');
const type = ['hass', 'hentai', 'hboobs'];

module.exports.run = async ({ message, guildData, userData }) => {
	await sendNekosAPI(message, type[Math.floor(Math.random() * type.length)]);

	if (guildData.tips && !guildData.premium && !userData.premium) {
		if (Math.floor(Math.random() * 25) === 9) {
			message.channel.send(
				'Want less randomness or kinkier stuff? Donators get access to many categories of their choosing.',
			);
		}
	}
};

module.exports.config = {
	isNSFW: true,
	name: 'hentai',
	aliases: ['random-hentai'],
};
