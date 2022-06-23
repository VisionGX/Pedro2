import { CommandInteraction, MessageActionRow, MessageEmbed, MessageSelectMenu } from "discord.js";
import Bot from "../../../Bot";
import GuildData from "../../../database/models/GuildData";
import { Interaction } from "../../../types/Executors";

const interaction: Interaction = {
	name: "embeds edit",
	type: "SUB_FUNCTION",
	description: "Edit an embed message.",
	category: "data",
	internal_category: "sub",
	async execute(client: Bot, interaction: CommandInteraction) {
		const repo = client.database.source.getRepository(GuildData);
		const guildData = await repo.findOne({
			where: {
				guildId: `${interaction.guildId}`,
			},
			relations: ["embeds"],
		});
		if (!guildData) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Guild Data not initialized")
					.setDescription("Please initialize this server's data with /config init.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});

		const { embeds } = guildData;
		if (!embeds || embeds.length === 0) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("No embeds found")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});

		const embedsEmbed = new MessageEmbed()
			.setTitle("Edit Embed")
			.setColor(`#${client.config.defaultEmbedColor}`)
			.setDescription("Select which embed you will edit.");
		const row = new MessageActionRow();
		const menu = new MessageSelectMenu();
		for (const embed of embeds) {
			const data = {
				label: embed.name,
				value: `${embed.id}`,
			};
			menu.addOptions(data);
		}
		menu.setCustomId("menu_embeds_edit");
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