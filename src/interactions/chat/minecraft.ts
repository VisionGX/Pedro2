import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import Bot from "../../Bot";
import MinecraftData from "../../database/models/MinecraftData";
import { Interaction } from "../../types/Executors";

const interaction: Interaction = {
	name: "minecraft",
	type: ApplicationCommandType.ChatInput,
	description: "Manage Minecraft Server's Auth.",
	category: "other",
	internal_category: "guild",
	options: [
		{
			name: "users",
			description: "User Management",
			type: ApplicationCommandOptionType.SubcommandGroup,
			options: [
				{
					name: "remove",
					description: "Remove a user from the database.",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "discord_user",
							description: "The discord user to remove.",
							type: ApplicationCommandOptionType.User,
							required: true,
						},
					]
				},
				{
					name: "list",
					description: "List all users in the database.",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "page",
							description: "The page to list.",
							type: ApplicationCommandOptionType.Integer,
							required: true,
						},
					]
				},
			],
		},
		{
			name: "servers",
			description: "Server Management",
			type: ApplicationCommandOptionType.SubcommandGroup,
			options: [
				{
					name: "create",
					description: "Add a user to the database.",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "identifier",
							description: "The PaperAPI identifier.",
							type: ApplicationCommandOptionType.String,
							required: true,
						},
						{
							name: "name",
							description: "A short recognizable name.",
							type: ApplicationCommandOptionType.String,
							required: true,
						},
					]
				},
				{
					name: "delete",
					description: "Remove a Server from the database.",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "name",
							description: "The name of ther server to delete.",
							type: ApplicationCommandOptionType.User,
							required: true,
						},
					]
				},
				{
					name: "list",
					description: "List all Servers in the database.",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "page",
							description: "The page to list.",
							type: ApplicationCommandOptionType.Integer,
							required: true,
						},
					]
				},
				{
					name: "addallowedrole",
					description: "Add a role to the allowed roles list.",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "name",
							description: "The name of the server to add the role to.",
							type: ApplicationCommandOptionType.String,
							required: true,
						},
						{
							name: "role",
							description: "The role to add.",
							type: ApplicationCommandOptionType.Role,
							required: true,
						},
					]
				},
			],
		}
	],
	async execute(client: Bot, interaction: ChatInputCommandInteraction) {
		if (
			!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild) &&
			!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator) &&
			!client.config.admins.includes(interaction.user.id)
		) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("You do not have permission to use this command.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		if (!interaction.guild) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("This command can only be used in a guild.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});


		const category = interaction.options.getSubcommand();
		const group = interaction.options.getSubcommandGroup();

		const mcDataRepo = client.database.source.getRepository(MinecraftData);
		const mcData = await mcDataRepo.findOne({ where: { guildId: interaction.guild.id } });
		if (!mcData) {
			await mcDataRepo.save({ guildId: interaction.guild.id });
		}

		const inter = client.interactions.get(`mc_${group}_${category}`);
		if (!inter) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Function not found.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});

		await inter.execute(client, interaction);
	}
};
export default interaction;