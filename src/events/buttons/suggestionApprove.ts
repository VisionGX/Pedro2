import { ButtonInteraction, Message, EmbedBuilder } from "discord.js";
import Bot from "../../Bot";
import GuildSuggestion from "../../database/models/GuildSuggestion";

export default async (client: Bot, interaction: ButtonInteraction) => {
	const id = interaction.customId.split("|")[1];
	const guildSuggestionRepo = client.database.source.getRepository(GuildSuggestion);
	const suggestion = await guildSuggestionRepo.findOne({ where: { id : parseInt(id) }, relations: ["config"] });
	if (!suggestion) return interaction.reply({
		embeds:[
			new EmbedBuilder()
				.setTitle("Suggestion not found")
				.setDescription("Please contact the bot's administrator.")
				.setColor(`#${client.config.defaultEmbedColor}`)
		]
	});
	const embed = new EmbedBuilder()
		.setTitle("Vote for this suggestion!")
		.setDescription(`${suggestion.value}`)
		.setFooter({
			text: `Suggested by ${client.users.cache.get(suggestion.author)}`,
			iconURL: `${client.users.cache.get(suggestion.author)?.avatarURL()}`
		})
		.setColor(`#${client.config.defaultEmbedColor}`);
	const channel = interaction.guild?.channels.cache.get(`${suggestion.config?.publicChannel}`);
	if (!channel || !channel.isTextBased()) return interaction.reply({
		embeds:[
			new EmbedBuilder()
				.setTitle("Channel not found")
				.setDescription("Please contact the bot's administrator.")
				.setColor(`#${client.config.defaultEmbedColor}`)
		]
	});
	const msg = await channel.send({
		embeds: [
			embed
		]
	});
	suggestion.activeMessageId = msg.id;
	await guildSuggestionRepo.save({...suggestion});
	await msg.react("✅");
	await msg.react("❌");

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setTitle("Suggestion Submitted!")
				.setDescription(`${suggestion.value}`)
				.setFooter({
					text: `Suggested by ${client.users.cache.get(suggestion.author)}`,
					iconURL: `${client.users.cache.get(suggestion.author)?.avatarURL()}`
				})
				.setColor(`#${client.config.defaultEmbedColor}`)
		]
	});
	if(interaction.message instanceof Message) {
		await interaction.message.delete();
	}
};