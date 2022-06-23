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
			description: "Welcome Configuration",
			type: "SUB_COMMAND_GROUP",
			options: [
				{
					name: "enabled",
					description: "Enable/Disable the welcome message.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "status",
							description: "Is the welcome message enabled.",
							type: "BOOLEAN",
							required: true,
						}
					]
				},
				{
					name: "channel",
					description: "Set the channel the welcome message will be sent to.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "welcome_channel",
							description: "The channel the welcome message will be sent to.",
							type: "CHANNEL",
							required: true,
						}
					]
				},
				{
					name: "message",
					description: "Set the welcome message.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "name",
							description: "The welcome message embed name.",
							type: "STRING",
							required: true,
						}
					]
				}
			],
		},
		{
			name: "verify",
			description: "Verification Configuration",
			type: "SUB_COMMAND_GROUP",
			options: [
				{
					name: "enabled",
					description: "Enable/Disable the verify message.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "status",
							description: "Is the verify message enabled.",
							type: "BOOLEAN",
							required: true,
						}
					]
				},
				{
					name: "channel",
					description: "Set the channel the verify message will be sent to.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "verify_channel",
							description: "The channel the verify message will be sent to.",
							type: "CHANNEL",
							required: true,
						}
					]
				},
				{
					name: "message",
					description: "Set the welcome message.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "name",
							description: "The verify message embed name.",
							type: "STRING",
							required: true,
						}
					]
				},
				{
					name: "button_label",
					description: "Set the button label.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "label",
							description: "The button label.",
							type: "STRING",
							required: true,
						}
					]
				},
				{
					name: "button_emoji",
					description: "Set the button emoji.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "emoji",
							description: "The button emoji.",
							type: "STRING",
							required: true,
						}
					]
				},
				{
					name: "role",
					description: "Set the role the user will be given when they verify.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "verified_role",
							description: "The role the user will be given when they verify.",
							type: "ROLE",
							required: true,
						}
					]
				},
				{
					name: "send",
					description: "Send the verification message to the configured channel.",
					type: "SUB_COMMAND",
				}
			],
		},
		{
			name: "init",
			description: "Initialize the bot's behaviour in this server.",
			type: "SUB_COMMAND",
		}
	],
	async execute(client: Bot, interaction: CommandInteraction) {
		if (
			!interaction.memberPermissions?.has("MANAGE_GUILD") &&
			!interaction.memberPermissions?.has("ADMINISTRATOR") &&
			!client.config.admins.includes(interaction.user.id)
		) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("You do not have permission to use this command.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		const category = interaction.options.getSubcommand();

		if (category === "init" && interaction.guildId) {
			const guildDataRepo = client.database.source.getRepository(GuildData);
			const guildData = await guildDataRepo.findOne({ where: { guildId: interaction.guildId } });
			if (!guildData) {
				const newGuildData = new GuildData();
				newGuildData.guildId = interaction.guildId;
				await guildDataRepo.save(newGuildData);
			}
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setTitle("Successfully initialized.")
						.setColor(`#${client.config.defaultEmbedColor}`)
				],
				ephemeral: true
			});
		}

		const group = interaction.options.getSubcommandGroup();


		const inter = client.interactions.get(`${group}_${category}`);
		if (!inter) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Configuration not found")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});

		await inter.execute(client, interaction);


	}
};
export default interaction;