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
			name: "suggestions",
			description: "Suggestions Configuration",
			type: "SUB_COMMAND_GROUP",
			options: [
				{
					name: "enabled",
					description: "Enable/Disable the suggestions.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "status",
							description: "Is the suggest command enabled.",
							type: "BOOLEAN",
							required: true,
						}
					]
				},
				{
					name: "channels",
					description: "Set the channel the welcome message will be sent to.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "admin_channel",
							description: "The channel suggestions will be sent to be reviewed.",
							type: "CHANNEL",
							required: true,
						},
						{
							name: "vote_channel",
							description: "The channel suggestions will be sent to be voted for.",
							type: "CHANNEL",
							required: true,
						}
					]
				},
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
			name: "minecraft",
			description: "Initialize the bot's behaviour in this server.",
			type: "SUB_COMMAND_GROUP",
			options: [
				{
					name: "enabled",
					description: "Enable/Disable the Minecraft server module.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "status",
							description: "Is the Minecraft server module enabled.",
							type: "BOOLEAN",
							required: true,
						},
						{
							name: "server_name",
							description: "PaperAPI Plugin provided unique Id.",
							type: "STRING",
						}
					]
				},
				{
					name: "log",
					description: "Set Up the logging system.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "enabled",
							description: "Enable/Disable the logging system.",
							type: "BOOLEAN",
							required: true,
						},
						{
							name: "channel",
							description: "Set the channel the logging will be sent to.",
							type: "CHANNEL",
						},
					]
				}
			]
		},
		{
			name: "museum",
			description: "Set a Museum dedicated Channel.",
			type: "SUB_COMMAND",
			options: [
				{
					name: "channel",
					description: "Set the channel Museum Messages will be Saved to.",
					type: "CHANNEL",
					required: true,
				}
			]
		},
		{
			name: "confessions",
			description: "Set a Confessions dedicated Channel.",
			type: "SUB_COMMAND",
			options: [
				{
					name: "channel",
					description: "Set the channel confession messages will be Sent to.",
					type: "CHANNEL",
					required: true,
				}
			]
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

		const group = interaction.options.getSubcommandGroup(false) ? interaction.options.getSubcommandGroup() : "config";


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