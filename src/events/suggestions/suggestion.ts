import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import Bot from "../../Bot";
import GuildSuggestion from "../../database/models/GuildSuggestion";


export default async (client: Bot, suggestion: GuildSuggestion) => {
	const guildSuggestionRepo = client.database.source.getRepository(GuildSuggestion);
	await guildSuggestionRepo.save(suggestion);

	const guildSuggest = suggestion.config;
	const guild = client.guilds.cache.get(guildSuggest.guildId);
	if (!guild) return client.logger.warn(`Guild ${guildSuggest.guildId} not found when sending suggestion`);
	const channel = guild.channels.cache.get(`${guildSuggest.privateChannel}`);
	if (!channel || !channel.isText()) return client.logger.warn(`Channel ${guildSuggest.privateChannel} not found when sending suggestion`);
	const embed = new MessageEmbed()
		.setTitle("Suggestion needs approval, this means that it will be sent to be voted for!")
		.setDescription(`${suggestion.value}`)
		.setFooter({
			text: `Suggested by ${client.users.cache.get(suggestion.author)}`,
			iconURL: `${client.users.cache.get(suggestion.author)?.avatarURL()}`
		})
		.setColor(`#${client.config.defaultEmbedColor}`);
	const row = new MessageActionRow();
	row.addComponents([
		new MessageButton()
			.setStyle("SUCCESS")
			.setLabel("Approve").setEmoji("✅")
			.setCustomId(`suggestionApprove|${suggestion.id}`),
		new MessageButton()
			.setStyle("DANGER")
			.setLabel("Deny").setEmoji("❌")
			.setCustomId(`suggestionDeny|${suggestion.id}`)
	]);
	const msg = await channel.send({
		embeds: [
			embed
		], 
		components: [
			row
		]
	});
	suggestion.activeMessageId = msg.id;
	await guildSuggestionRepo.save(suggestion);
};