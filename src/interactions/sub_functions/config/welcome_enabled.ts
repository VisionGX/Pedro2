import { CommandInteraction, MessageEmbed } from "discord.js";
import Bot from "../../../Bot";
import GuildData from "../../../database/models/GuildData";
import GuildWelcome from "../../../database/models/GuildWelcome";
import { Interaction } from "../../../types/Executors";
const interaction: Interaction = {
	name: "welcome enabled",
	type: "SUB_FUNCTION",
	description: "Configure the welcome message enabled.",
	category: "config",
	internal_category: "sub",
	async execute(client: Bot, interaction: CommandInteraction, guildData: GuildData) {
		const welcomeRepo = client.database.source.getRepository(GuildWelcome);
		const enabled = interaction.options.getBoolean("enabled") || false;
		const welcome = await welcomeRepo.findOne({ where: { guildId: guildData.guildId } });
		if (welcome) {
			await welcomeRepo.save({ ...welcome, enabled });
		} else {
			const guildRepo = client.database.source.getRepository(GuildData);
			const newWelcome = welcomeRepo.create({ guildId: guildData.guildId, enabled });
			await welcomeRepo.save(newWelcome);
			await guildRepo.save({ ...guildData, welcome: newWelcome });
		}
		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle(`Welcome Message Enabled`)
					.setDescription(`Welcome message is now ${enabled ? "**enabled**" : "**disabled**"}`)
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
	}
};
export default interaction;