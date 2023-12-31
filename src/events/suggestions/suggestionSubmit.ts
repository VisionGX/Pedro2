import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import GuildSuggestion from "../../database/models/GuildSuggestion";
import { EventExecutor } from "../../types/Executors";


const e: EventExecutor<{ suggestion: GuildSuggestion }> = async (client, params) => {
	const { suggestion } = params;
	const guildSuggestionRepo = client.database.source.getRepository(GuildSuggestion);
	await guildSuggestionRepo.save(suggestion);

	const guildSuggest = suggestion.config;
	const guild = client.guilds.cache.get(guildSuggest.guildId);
	if (!guild) return client.logger.warn(`Guild ${guildSuggest.guildId} not found when sending suggestion`);
	const channel = guild.channels.cache.get(`${guildSuggest.privateChannel}`);
	if (!channel || !channel.isTextBased()) return client.logger.warn(`Channel ${guildSuggest.privateChannel} not found when sending suggestion`);
	const embed = new EmbedBuilder()
		.setTitle("Suggestion needs approval, this means that it will be sent to be voted for!")
		.setDescription(`${suggestion.value}`)
		.setFooter({
			text: `Suggested by ${client.users.cache.get(suggestion.author)}`,
			iconURL: `${client.users.cache.get(suggestion.author)?.avatarURL()}`
		})
		.setColor(`#${client.config.defaultEmbedColor}`);
	const row = new ActionRowBuilder<ButtonBuilder>();
	row.addComponents([
		new ButtonBuilder()
			.setStyle(ButtonStyle.Success)
			.setLabel("Approve").setEmoji("✅")
			.setCustomId(`suggestionApprove|${suggestion.id}`),
		new ButtonBuilder()
			.setStyle(ButtonStyle.Danger)
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
export default e;