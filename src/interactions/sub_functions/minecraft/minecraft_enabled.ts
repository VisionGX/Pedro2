import { CommandInteraction, MessageEmbed } from "discord.js";
import Bot from "../../../Bot";
import GuildData from "../../../database/models/GuildData";
import MinecraftData from "../../../database/models/MinecraftData";
import { Interaction } from "../../../types/Executors";
const interaction: Interaction = {
	name: "minecraft enabled",
	type: "SUB_FUNCTION",
	description: "Configure the Minecraft module enabled.",
	category: "config",
	internal_category: "sub",
	async execute(client: Bot, interaction: CommandInteraction) {
		const guildDataRepo = client.database.source.getRepository(GuildData);
		const guildData = await guildDataRepo.findOne({ where: { guildId: `${interaction.guildId}` } });
		if (!guildData) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Guild Data not initialized")
					.setDescription("Please initialize this server's data with /config init.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
		const mcDataRepo = client.database.source.getRepository(MinecraftData);
		const enabled = interaction.options.getBoolean("status") || false;
		/* if (enabled && !serverName) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Missing server name")
					.setDescription("Please provide a server name.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		}); */
		const mcData = await mcDataRepo.findOne({ where: { guildId: guildData.guildId } });
		if (mcData) {
			await mcDataRepo.save({ ...mcData, enabled: enabled ? enabled : false });
		} else {
			const guildRepo = client.database.source.getRepository(GuildData);
			const newMcData = mcDataRepo.create({ guildId: `${guildData.guildId}`, });
			await mcDataRepo.save(newMcData);
			await guildRepo.save({ ...guildData, verify: newMcData });
		}
		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Minecraft Module Config")
					.setDescription(`Minecraft Module is now ${enabled ? "**enabled**" : "**disabled**"}`)
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
	}
};
export default interaction;