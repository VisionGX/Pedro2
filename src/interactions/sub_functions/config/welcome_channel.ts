import { CommandInteraction, MessageEmbed, TextChannel } from "discord.js";
import Bot from "../../../Bot";
import GuildWelcome from "../../../database/models/GuildWelcome";
import { Interaction } from "../../../types/Executors";

const interaction: Interaction = {
	name: "welcome channel",
	type: "SUB_FUNCTION",
	description: "Configure the welcome message channel.",
	category: "config",
	internal_category: "sub",
	async execute(client: Bot, interaction: CommandInteraction) {
		const welcomeRepo = client.database.source.getRepository(GuildWelcome);
		const welcome = await welcomeRepo.findOne({ where: { guildId: `${interaction.guildId}` } });
		if (!welcome) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Welcome message not found")
					.setDescription("Please enable the welcome message first.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
		const channel = interaction.options.getChannel("welcome_channel");
		if (!channel) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("No channel provided")
					.setDescription("Please provide a channel for the welcome message to be sent every time someone joins.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		if (!(channel instanceof TextChannel)) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Invalid channel")
					.setDescription("Please provide a text channel for the welcome message to be sent every time someone joins.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});


		if (!channel.guild.me?.permissionsIn(channel).has("SEND_MESSAGES")) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("I don't have permission to send messages in that channel")
					.setDescription("Please make sure I have permission to send messages in that channel.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});

		welcome.channel = channel.id;
		await welcomeRepo.save(welcome);

		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Welcome Message Config")
					.setDescription(`The welcome message channel has been set to ${channel.toString()}`)
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
	}
};
export default interaction;