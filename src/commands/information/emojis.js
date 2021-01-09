const { MessageEmbed } = require('discord.js');
const colors = require('../../../assets/config/colors.json');
const { formatDate, getTimeSince } = require('../../tools');

function checkDays(date) {
	let now = new Date();
	let diff = now.getTime() - date.getTime();
	let days = Math.floor(diff / 86400000);
	return days + (days == 1 ? ' day' : ' days') + ' ago';
}

const filterNum = (str) => {
	const numericalChar = new Set([
		'0',
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
	]);
	str = str
		.split('')
		.filter((char) => numericalChar.has(char))
		.join('');
	return str;
};

const chunks = function (array, size) {
	let results = [];
	while (array.length) {
		results.push(array.splice(0, size));
	}
	return results;
};

module.exports.run = async ({ message, args }) => {
	let option = args.shift();

	if (option) {
		if (!isNaN(filterNum(option))) {
			let emoji = message.guild.emojis.cache.get(filterNum(option));

			if (emoji) {
				const e = new MessageEmbed()
					.setAuthor(`${emoji.name}`)
					.setDescription(
						`Animated: ${emoji.animated}\nID: \`${
							emoji.id
						}\`\nCreated: ${formatDate(
							emoji.createdAt,
						)} (*${getTimeSince(emoji.createdAt)}*)`,
					)
					.setColor(colors.info)
					.setThumbnail(emoji.url);

				return message.channel.send(e);
			} else {
				let emojiList = [];

				message.guild.emojis.cache.forEach((e, x) => {
					emojiList.push(`${e} | \`${x}\` | ${e.name}`);
				});

				if (emojiList.length <= 0) {
					const e = new MessageEmbed()
						.setAuthor('Guild Emoji list')
						.setDescription('No emojis have been found.')

						.setColor(colors.info);
					return message.channel.send(e);
				}

				if (emojiList.length >= 26) {
					let arrLength = emojiList.length;

					let chunk = chunks(emojiList, 25);

					let pages = chunk.length;
					let i = 1;

					chunk.forEach((ch) => {
						const e = new MessageEmbed();
						if (i === 1)
							e.setDescription(
								'Splitting all emojis into groups of 25 to not exceed 2000 characters.\n' +
									ch.join('\n'),
							).setAuthor(`Guild Emoji list`);
						else e.setDescription(ch.join('\n'));
						e.setFooter(
							`${arrLength} emojis found • Page ${i}/${pages}`,
						).setColor(colors.info);

						message.channel.send(e);
						i++;
					});
				} else {
					const e = new MessageEmbed()
						.setAuthor('Guild Emoji list')
						.setDescription(emojiList)
						.setFooter(`${emojiList.length} emojis found`)
						.setColor(colors.info);
					return message.channel.send(e);
				}
			}
		}
	} else {
		let emojiList = [];

		message.guild.emojis.cache.forEach((e, x) => {
			emojiList.push(`${e} | \`${x}\` | ${e.name}`);
		});

		if (emojiList.length <= 0) {
			const e = new MessageEmbed()
				.setAuthor('Guild Emoji list')
				.setDescription('No emojis have been found.')

				.setColor(colors.info);
			return message.channel.send(e);
		}

		if (emojiList.length >= 26) {
			let arrLength = emojiList.length;

			let chunk = chunks(emojiList, 25);

			let pages = chunk.length;
			let i = 1;

			chunk.forEach((ch) => {
				const e = new MessageEmbed();
				if (i === 1)
					e.setDescription(
						'Splitting all emojis into groups of 25 to not exceed 2000 characters.\n' +
							ch.join('\n'),
					).setAuthor(`Guild Emoji list`);
				else e.setDescription(ch.join('\n'));
				e.setFooter(
					`${arrLength} emojis found • Page ${i}/${pages}`,
				).setColor(colors.info);

				message.channel.send(e);
				i++;
			});
		} else {
			const e = new MessageEmbed()
				.setAuthor('Guild Emoji list')
				.setDescription(emojiList)
				.setFooter(`${emojiList.length} emojis found`)
				.setColor(colors.info);
			return message.channel.send(e);
		}
	}
};

module.exports.config = {
	name: 'emojis',
	aliases: ['emoji', 'guild-emojis', 'server-emojis'],
};
