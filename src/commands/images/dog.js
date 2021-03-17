const { sendSomeRandomAnimalAPI } = require('../../utils/helper');

module.exports.run = async ({ message }) => {
	return await sendSomeRandomAnimalAPI(message, 'dog');
};

module.exports.config = {
	name: 'dog',
	aliases: ['dog-image', 'dog-fact'],
};
