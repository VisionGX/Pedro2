import { CommandInteraction, MessageEmbed } from "discord.js";
import Bot from "../../../Bot";
import GuildWelcome from "../../../database/models/GuildWelcome";
import DatabaseEmbed from "../../../database/models/MessageEmbed";
import { Interaction } from "../../../types/Executors";

const interaction: Interaction = {
	name: "welcome message",
	type: "SUB_FUNCTION",
	description: "Configure the welcome message embed.",
	category: "config",
	internal_category: "sub",
	async execute(client: Bot, interaction: CommandInteraction) {
		const welcomeRepo = client.database.source.getRepository(GuildWelcome);
		const welcome = await welcomeRepo.findOne({ where: { guildId:`${interaction.guildId}` } });
		if(!welcome) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Welcome message not found")
					.setDescription("Please enable the welcome message first.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
		const msgName = interaction.options.getString("name");
		if(!msgName) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("No message name provided")
					.setDescription("Please provide a name for the message.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		const embedRepo = client.database.source.getRepository(DatabaseEmbed);
		const embed = await embedRepo.findOne({ where: { name: msgName } });
		if(!embed) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Message not found")
					.setDescription("An embed with that name does not exist, you may need to create one first.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		welcome.message = embed;
		await welcomeRepo.save(welcome);

		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Welcome message updated")
					.setDescription("The welcome message has been updated.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
	}
};
export default interaction;