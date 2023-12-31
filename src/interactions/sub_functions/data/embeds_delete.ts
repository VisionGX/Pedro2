import { ChatInputCommandInteraction, ActionRowBuilder, EmbedBuilder, SelectMenuBuilder } from "discord.js";
import Bot from "../../../Bot";
import GuildData from "../../../database/models/GuildData";
import { Interaction } from "../../../types/Executors";

const interaction: Interaction = {
	name: "embeds delete",
	type: "SubFunction",
	description: "Delete an embed message.",
	category: "data",
	internal_category: "sub",
	async execute(client: Bot, interaction: ChatInputCommandInteraction) {
		const repo = client.database.source.getRepository(GuildData);
		const guildData = await repo.findOne({
			where: {
				guildId: `${interaction.guildId}`,
			},
			relations: ["embeds"],
		});
		if (!guildData) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Guild Data not initialized")
					.setDescription("Please initialize this server's data with /config init.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});

		const { embeds } = guildData;
		if (!embeds || embeds.length === 0) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("No embeds found")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});

		const embedsEmbed = new EmbedBuilder()
			.setTitle("Delete Embed")
			.setColor(`#${client.config.defaultEmbedColor}`)
			.setDescription("Select which embed you will delete.");
		const row = new ActionRowBuilder<SelectMenuBuilder>();
		const menu = new SelectMenuBuilder();
		for (const embed of embeds) {
			const data = {
				label: embed.name, 
				value: `${embed.id}`,
			};
			menu.addOptions(data);
		}
		menu.setCustomId("menu_embeds_delete");
		row.addComponents(menu);

		await interaction.reply({
			embeds: [
				embedsEmbed,
			],
			components: [
				row,
			],
		});
	}
};
export default interaction;