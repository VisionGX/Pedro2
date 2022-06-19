import { CommandInteraction, MessageEmbed } from "discord.js";
import Bot from "../../Bot";
import GuildData from "../../database/models/GuildData";
import { Interaction } from "../../types/Executors";

const interaction: Interaction = {
	name: "config",
	type: "CHAT_INPUT",
	description: "Configure the bot's behaviour in this server.",
	category: "other",
	internal_category: "guild",
	options: [
		{
			name: "welcome",
			description: "Configuration Category",
			type: "SUB_COMMAND_GROUP",
			options: [
				{
					name: "enabled",
					description: "Enable/Disable the welcome message.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "enabled",
							description: "Is the welcome message enabled.",
							type: "BOOLEAN",
						}
					]
				},
				{
					name: "channel",
					description: "Set the channel the welcome message will be sent to.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "channel",
							description: "The channel the welcome message will be sent to.",
							type: "CHANNEL",
						}
					]
				},
				{
					name: "message",
					description: "Configure the welcome message.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "message",
							description: "Message to be displayed when a new member joins the server.",
							type: "STRING",
							required: true
						}
					]
				},
				{
					name: "image",
					description: "Configure the welcome image.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "image",
							description: "Image to be displayed when a new member joins the server.",
							type: "STRING",
							required: true
						}
					]
				},
				{
					name: "thumbnail",
					description: "Configure the welcome thumbnail.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "thumbnail",
							description: "Thumbnail to be displayed when a new member joins the server.",
							type: "STRING",
							required: true
						}
					]
				},
				{
					name: "footer",
					description: "Configure the welcome footer.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "footer",
							description: "Footer to be displayed when a new member joins the server.",
							type: "STRING",
							required: true
						},
						{
							name: "url",
							description: "Footer Icon URL.",
							type: "STRING",
						}
					]
				},
				{
					name: "title",
					description: "Configure the welcome title.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "title",
							description: "Title to be displayed when a new member joins the server.",
							type: "STRING",
							required: true
						},
						{
							name: "url",
							description: "URL in the title.",
							type: "STRING",
						}
					]
				},
				{
					name: "author",
					description: "Configure the welcome author.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "author",
							description: "Author to be displayed when a new member joins the server.",
							type: "STRING",
							required: true
						},
						{
							name: "url",
							description: "Author Icon URL.",
							type: "STRING",
						}
					]
				}
			]
		}
	],
	async execute(client: Bot, interaction: CommandInteraction, guildData: GuildData) {
		const group = interaction.options.getSubcommandGroup();
		const category = interaction.options.getSubcommand();

		const inter = client.interactions.get(`${group}_${category}`);
		if (!inter) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle(`Configuration not found`)
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});

		await inter.execute(client, interaction, guildData);


	}
};
export default interaction;