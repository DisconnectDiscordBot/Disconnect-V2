// Get Member
module.exports.fetchMember = (message, find = '') => {
	find = find.toLowerCase();

	let result = message.guild.members.cache.get(find);

	if (!result && message.mentions.members)
		result = message.mentions.members.first();

	if (!result && find) {
		result = message.guild.members.cache.find((user) => {
			return (
				user.displayName.toLowerCase().includes(find) ||
				user.user.tag.toLowerCase().includes(find)
			);
		});
	}

	if (!result) return null;
	return result;
};
