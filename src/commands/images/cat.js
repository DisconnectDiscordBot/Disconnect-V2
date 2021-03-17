const { sendSomeRandomAnimalAPI } = require('../../utils/helper');

module.exports.run = async ({ message }) => {
	return await sendSomeRandomAnimalAPI(message, 'cat');
};

module.exports.config = {
	name: 'cat',
	aliases: ['cat-image', 'cat-fact'],
};
