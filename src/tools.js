// Get Member
module.exports.fetchMember = (message, find = '') => {
	find = find.toLowerCase();

	let result = message.guild.members.cache.get(find);

	if (!result && message.mentions.members)
		result = message.mentions.members.first();

	if (!result && find) {
		result = message.guild.members.cache.find((user) => {
			return (
				member.displayName.toLowerCase().includes(user) ||
				member.user.tag.toLowerCase().includes(user)
			);
		});
	}

	if (!result) return null;
	return result;
};
