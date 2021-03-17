const pandas = ['panda', 'red_panda'];
const animals = ['panda', 'bird', 'koala'];
const { sendSomeRandomAnimalAPI } = require('../../utils/helper');

module.exports.run = async ({ message }) => {
	const animal = animals[Math.floor(Math.random() * animals.length)];
	const query =
		animal === 'bird'
			? 'birb'
			: animal === 'panda'
			? pandas[Math.floor(Math.random() * pandas.length)]
			: animal;
	return await sendSomeRandomAnimalAPI(message, animal, query);
};

module.exports.config = {
	name: 'animal',
	aliases: ['random-animal'],
};
