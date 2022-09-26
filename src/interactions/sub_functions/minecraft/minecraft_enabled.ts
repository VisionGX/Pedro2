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
		
		const mcDataRepo = client.database.source.getRepository(MinecraftData);
		const enabled = interaction.options.getBoolean("status") || false;
		const mcData = await mcDataRepo.findOne({ where: { guildId:`${interaction.guildId}` } });
		if (mcData) {
			await mcDataRepo.save({ ...mcData, enabled: enabled ? enabled : false });
		} else {
			const newMcData = new MinecraftData();
			newMcData.guildId = `${interaction.guildId}`;
			newMcData.enabled = enabled ? enabled : false;
			await mcDataRepo.save(newMcData);
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