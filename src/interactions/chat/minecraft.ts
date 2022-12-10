import { CommandInteraction, MessageEmbed } from "discord.js";
import Bot from "../../Bot";
import MinecraftData from "../../database/models/MinecraftData";
import { Interaction } from "../../types/Executors";

const interaction: Interaction = {
	name: "minecraft",
	type: "CHAT_INPUT",
	description: "Manage Minecraft Server's Auth.",
	category: "other",
	internal_category: "guild",
	options: [
		{
			name: "users",
			description: "User Management",
			type: "SUB_COMMAND_GROUP",
			options: [
				{
					name: "add",
					description: "Add a user to the database.",
					type: "SUB_COMMAND",
					options: [
						{
							name:"discord_user",
							description: "The discord user to add.",
							type: "USER",
							required: true,
						},
						{
							name: "username",
							description: "The username of the user to add.",
							type: "STRING",
							required: true,
						},
						{
							name: "type",
							description: "The type of user to add.",
							type: "STRING",
							choices: [
								{
									name: "Admin",
									value: "admin",
								},
								{
									name: "User",
									value: "user",
								},
							],
							required: true,
						}
					]
				},
				{
					name: "remove",
					description: "Remove a user from the database.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "discord_user",
							description: "The discord user to remove.",
							type: "USER",
							required: true,
						},
					]
				},
				{
					name: "list",
					description: "List all users in the database.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "page",
							description: "The page to list.",
							type: "INTEGER",
							required: true,
						},
					]
				},
			],
		},
		{
			name: "servers",
			description: "Server Management",
			type: "SUB_COMMAND_GROUP",
			options: [
				{
					name: "create",
					description: "Add a user to the database.",
					type: "SUB_COMMAND",
					options: [
						{
							name:"identifier",
							description: "The PaperAPI identifier.",
							type: "STRING",
							required: true,
						},
						{
							name: "name",
							description: "A short recognizable name.",
							type: "STRING",
							required: true,
						},
					]
				},
				{
					name: "delete",
					description: "Remove a Server from the database.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "name",
							description: "The name of ther server to delete.",
							type: "USER",
							required: true,
						},
					]
				},
				{
					name: "list",
					description: "List all Servers in the database.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "page",
							description: "The page to list.",
							type: "INTEGER",
							required: true,
						},
					]
				},
				{
					name: "adduser",
					description: "Add a user to a server.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "name",
							description: "The server to add the user to.",
							type: "STRING",
							required: true,
						},
						{
							name: "user",
							description: "The user to add to the server.",
							type: "USER",
							required: true,
						},
					]
				},
				{
					name: "removeuser",
					description: "Remove a user from a server.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "name",
							description: "The server to remove the user from.",
							type: "STRING",
							required: true,
						},
						{
							name: "user",
							description: "The user to remove from the server.",
							type: "USER",
							required: true,
						},
					]
				},
				{
					name: "listusers",
					description: "List all users in a server.",
					type: "SUB_COMMAND",
					options: [
						{
							name: "name",
							description: "The server to list users from.",
							type: "STRING",
							required: true,
						},
						{
							name: "page",
							description: "The page to list.",
							type: "INTEGER",
							required: true,
						},
					]
				},
			],
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
		const group = interaction.options.getSubcommandGroup();

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

		const inter = client.interactions.get(`mc_${group}_${category}`);
		if (!inter) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Function not found.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});

		await inter.execute(client, interaction);
	}
};
export default interaction;