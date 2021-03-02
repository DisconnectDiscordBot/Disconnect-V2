const { client } = require('../../bot');
const { createCanvas, loadImage } = require('canvas');
const { MessageAttachment, Message } = require('discord.js');
const { formatOrdinal, getJoinPosition } = require('../../tools');
const { get: getGuild } = require('../../models/guilds');

// Manage Text
const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');
	let fontSize = 56;

	// Make sure the text doesn't overflow off the canvas;
	do {
		ctx.font = `${(fontSize -= 10)}px sans-serif`;
	} while (ctx.measureText(text).width > canvas.width - 300);

	return ctx.font;
};

client.on('guildMemberRemove', async (member) => {
	if (!member) return;

	const guild = member.guild;
	const guildData = await getGuild(guild);

	if (!guildData || !guildData.farewellEnabled) return;
	if (!guildData.farewellChannel) return;
	const channel = client.channels.cache.get(guildData.farewellChannel);

	// Check to make sure the bot can speak
	if (!channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;

	// Check format
	if (!guildData.farewellFormat || guildData.farewellFormat === 'image') {
		// Create our canvas
		const canvas = createCanvas(1000, 333);
		const ctx = canvas.getContext('2d');

		// Add background
		const backgroundImage = await loadImage(
			'./assets/images/background.png',
		);
		ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

		// Welcome User
		ctx.fillStyle = '#ffffff';
		ctx.font = applyText(canvas, `Farewell, ${member.displayName}`);
		ctx.fillText(
			`Farewell, ${member.displayName}`,
			canvas.width / 3,
			canvas.height / 1.9,
		);

		// Add their avatar
		ctx.arc(170, 160, 120, 0, Math.PI * 2, true);
		ctx.lineWidth = 6;
		ctx.strokeStyle = '#FFFFFF';
		ctx.stroke();
		ctx.closePath();
		ctx.clip();
		const avatar = await loadImage(
			member.user
				.displayAvatarURL({ dynamic: true })
				.replace('.webp', '.jpg') + '?size=1024',
		);
		ctx.drawImage(avatar, 40, 40, 250, 250);

		// Add the new image as a attachment
		const attachment = new MessageAttachment(
			canvas.toBuffer(),
			'farewell.png',
		);

		// Send message
		channel.send(attachment);
	} else {
		return channel.send(`Farewell, ${member.displayName}!`);
	}
});
