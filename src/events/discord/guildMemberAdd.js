const { client } = require('../../bot');
const { createCanvas, loadImage } = require('canvas');
const { MessageAttachment } = require('discord.js');
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

client.on('guildMemberAdd', async (member) => {
	if (!member) {
		return;
	}

	const guild = member.guild;
	const guildData = await getGuild(guild);

	if (
		!guildData ||
		!guildData.welcomingEnabled ||
		!guildData.welcomingChannel
	) {
		return;
	}
	const channel = client.channels.cache.get(guildData.welcomingChannel);

	// Check to make sure the bot can speak
	if (!channel.permissionsFor(client.user).has('SEND_MESSAGES')) {
		return;
	}

	// Check format
	if (!guildData.welcomingFormat || guildData.welcomingFormat === 'image') {
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
		ctx.font = applyText(canvas, `Welcome, ${member.displayName}`);
		ctx.fillText(
			`Welcome, ${member.displayName}`,
			canvas.width / 3,
			canvas.height / 2.4,
		);

		// What number member they are
		const guildText = `to ${guild.name}!!`;
		ctx.font = applyText(canvas, guildText);
		ctx.fillText(guildText, canvas.width / 3, canvas.height / 1.6);

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
			'welcome.png',
		);

		// Send message
		return channel.send(attachment);
	} else {
		return channel.send(
			`Welcome, ${member.displayName} to **${guild.name}**!`,
		);
	}
});
