import { CommandInteraction, MessageEmbed } from "discord.js";
import Bot from "../../../Bot";
import MinecraftData from "../../../database/models/MinecraftData";
import MinecraftLog from "../../../database/models/MinecraftLog";
import { Interaction } from "../../../types/Executors";

const interaction: Interaction = {
	name: "minecraft log",
	type: "SUB_FUNCTION",
	description: "Configure the minecraft log system.",
	category: "config",
	internal_category: "sub",
	async execute(client: Bot, interaction: CommandInteraction) {
		const mcDataRepo = client.database.source.getRepository(MinecraftData);
		const mcData = await mcDataRepo.findOne({ where: { guildId: `${interaction.guildId}` } });
		if (!mcData || !mcData.enabled) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Minecraft Module not enabled")
					.setDescription("Please enable the minecraft module first.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
		const enabled = interaction.options.getBoolean("enabled");
		const logChannel = interaction.options.getChannel("channel");
		if (enabled && !logChannel) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Missing log channel")
					.setDescription("Please provide a channel to log to.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
		const mcLogRepo = client.database.source.getRepository(MinecraftLog);
		const mcLog = mcData.log;
		if (mcLog) {
			const mcLogUpdated = {
				...mcLog,
				enabled: enabled ? enabled : false,
				channelId: logChannel ? `${logChannel.id}` : undefined
			};
			await mcLogRepo.save(mcLogUpdated);
		} else {
			const newMcLog = mcLogRepo.create({
				data : mcData,
				guildId : `${interaction.guildId}`,
				enabled : enabled ? enabled : false,
			});
			await mcLogRepo.save(newMcLog);
			await mcDataRepo.save({ ...mcData, log: newMcLog });
		}
		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Minecraft Logging Config")
					.setDescription(`Minecraft Logging is now ${enabled ? "**enabled**" : "**disabled**"}`)
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});

	}
};
export default interaction;