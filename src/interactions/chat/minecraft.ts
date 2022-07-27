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
			name: "user",
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
							type: "NUMBER",
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