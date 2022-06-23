import { CommandInteraction, MessageEmbed } from "discord.js";
import Bot from "../../../Bot";
import GuildVerify from "../../../database/models/GuildVerify";
import { Interaction } from "../../../types/Executors";

const interaction: Interaction = {
	name: "verify button emoji",
	type: "SUB_FUNCTION",
	description: "Configure the verify button emoji.",
	category: "config",
	internal_category: "sub",
	async execute(client: Bot, interaction: CommandInteraction) {
		const verifyRepo = client.database.source.getRepository(GuildVerify);
		const verify = await verifyRepo.findOne({ where: { guildId:`${interaction.guildId}` } });
		if(!verify) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Verify Message not found")
					.setDescription("Please enable the verify message first.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
		const emoji = interaction.options.getString("emoji");
		if(!emoji) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("No label provided")
					.setDescription("Please provide a label.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		// Emoji is valid?
		const valid = interaction.guild?.emojis.cache.has(emoji);
		if(!valid) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Invalid emoji")
					.setDescription("Please provide a valid emoji.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		verify.emoji = emoji;
		await verifyRepo.save(verify);

		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Verify Button Emoji Updated")
					.setDescription("The verify button emoji has been updated.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
	}
};
export default interaction;