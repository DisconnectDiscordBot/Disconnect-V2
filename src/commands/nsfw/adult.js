const { sendNekosAPI } = require('../../utils/helper');
const type = ['boobs', 'ass', 'pussy', 'gonewild'];

module.exports.run = async ({ message, guildData, userData }) => {
	await sendNekosAPI(message, type[Math.floor(Math.random() * type.length)]);

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
