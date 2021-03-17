const { sendSomeRandomAnimalAPI } = require('../../utils/helper');

module.exports.run = async ({ message }) => {
	return await sendSomeRandomAnimalAPI(message, 'fox');
};

module.exports.config = {
	name: 'fox',
	aliases: ['fox-image', 'fox-fact'],
};
