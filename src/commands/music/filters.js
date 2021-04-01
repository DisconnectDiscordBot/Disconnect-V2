const { play } = require('../../utils/play');
const filterInfo = require('../../utils/filters.json');
const { MessageEmbed } = require('discord.js');
const palette = require('../../../assets/colors.json');

module.exports.run = async ({ message, args, queue }) => {
	// Get supported filters
	const filters = Object.keys(filterInfo);

	// Check args
	const changingFilter =
		args[0] && !filters[args[0].toLowerCase()]
			? args[0].toLowerCase()
			: null;

	if (changingFilter) {
		if (queue.filters.includes(changingFilter)) {
			queue.filters.splice(queue.filters.indexOf(changingFilter), 1);
			play(queue, true);
		} else {
			queue.filters.push(changingFilter);
			play(queue, true);
		}
	}

	// Create and send embed
	const e = new MessageEmbed()
		.setTitle('Disconnect Audio Filters')
		.setColor(palette.secondary)
		.setDescription(
			"These filters edit many aspects of the music you here. Feel free to combine and make some combo's that sound cool together.",
		)
		.addField(
			'Inactive Filters',
			filters.filter((f) => !queue.filters.includes(f)),
			true,
		)
		.addField(
			'Inactive Filters',
			queue.filters.length ? queue.filters : 'No filters applied',
			true,
		)
		.setFooter(
			'Filters may take a moment to activate. Filters are exempt from live streams',
		);
	return message.channel.send(e);
};

module.exports.config = {
	name: 'filters',
	isPlaying: true,
	aliases: 'filter',
};
