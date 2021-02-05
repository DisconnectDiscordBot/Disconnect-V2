const {
	flip_text: flippedDictionary,
} = require('../../assets/translation.json');

module.exports.flip_text = async (text) => {
	const originalText = text.split('').reverse();
	const flippedText = [];

	for (const char of originalText) {
		flippedText.push(
			flippedDictionary[char] ? flippedDictionary[char] : char,
		);
	}

	return flippedText.join('');
};
