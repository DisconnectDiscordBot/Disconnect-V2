const foods = ['food', 'coffee'];
const { sendNekosAPI } = require('../../utils/helper');

module.exports.run = async ({ message }) => {
	return await sendNekosAPI(
		message,
		foods[Math.floor(Math.random() * foods.length)],
	);
};

module.exports.config = {
	name: 'food',
	aliases: ['random-food'],
};
