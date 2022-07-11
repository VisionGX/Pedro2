import { CommandInteraction, MessageEmbed } from "discord.js";
import Bot from "../../../Bot";
import GuildData from "../../../database/models/GuildData";
import GuildSuggest from "../../../database/models/GuildSuggest";
import { Interaction } from "../../../types/Executors";
const interaction: Interaction = {
	name: "suggestions enabled",
	type: "SUB_FUNCTION",
	description: "Configure the suggestions enabled.",
	category: "config",
	internal_category: "sub",
	async execute(client: Bot, interaction: CommandInteraction) {
		const guildDataRepo = client.database.source.getRepository(GuildData);
		const guildData = await guildDataRepo.findOne({ where: { guildId:`${interaction.guildId}` } });
		if(!guildData) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Guild Data not initialized")
					.setDescription("Please initialize this server's data with /config init.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
		const suggestRepo = client.database.source.getRepository(GuildSuggest);
		const enabled = interaction.options.getBoolean("status") || false;
		const suggest = await suggestRepo.findOne({ where: { guildId: guildData.guildId } });
		if (suggest) {
			await suggestRepo.save({ ...suggest, enabled });
		} else {
			const newSuggest = suggestRepo.create({ guildId: guildData.guildId, enabled });
			await suggestRepo.save(newSuggest);
			await guildDataRepo.save({ ...guildData, suggest: newSuggest });
		}
		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Suggestions Config")
					.setDescription(`Suggestions are now ${enabled ? "**enabled**" : "**disabled**"}`)
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
	}
};
export default interaction;