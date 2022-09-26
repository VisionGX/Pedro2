import { CommandInteraction, MessageEmbed } from "discord.js";
import Bot from "../../Bot";
import HalloweenEventData from "../../database/models/HalloweenEventData";
import { Interaction } from "../../types/Executors";

const interaction: Interaction = {
	name: "minecrafthalloween",
	type: "CHAT_INPUT",
	description: "Manage Minecraft Server's Auth.",
	category: "other",
	internal_category: "guild",
	options: [
		{
			name: "config",
			description: "Config Management",
			type: "SUB_COMMAND",
			options: [
				{
					name: "rounds",
					description: "How many rounds of the game will be played",
					type: "NUMBER",
					required: true,
				},
				{
					name: "players",
					description: "How many players will be playing per round",
					type: "NUMBER",
					required: true,
				},
			],
		},
		{
			name: "set_round",
			description: "Set the current round",
			type: "SUB_COMMAND",
			options: [
				{
					name: "number",
					description: "The round number to set",
					type: "NUMBER",
					required: true,
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
		const command = interaction.options.getSubcommand();

		const hwDataRepo = client.database.source.getRepository(HalloweenEventData);
		const hwData = await hwDataRepo.findOne({ where: { guildId: `${interaction.guildId}` } }) || new HalloweenEventData();
		hwData.guildId = `${interaction.guildId}`;

		if (command === "config") {
			const rounds = interaction.options.getNumber("rounds");
			const players = interaction.options.getNumber("players");
			if (!rounds || !players) return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setTitle("You must provide a number of rounds and players.")
						.setColor(`#${client.config.defaultEmbedColor}`)
				],
				ephemeral: true
			});
			hwData.rounds = rounds;
			hwData.playerCount = players;
			await hwDataRepo.save(hwData);

			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setTitle("Successfully updated the config.")
						.setColor(`#${client.config.defaultEmbedColor}`)
				],
				ephemeral: true
			});
		}
		if (command === "set_round") {
			const round = interaction.options.getNumber("number");
			if (!round) return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setTitle("You must provide a round number.")
						.setColor(`#${client.config.defaultEmbedColor}`)
				],
				ephemeral: true
			});
			hwData.currentRound = round;
			await hwDataRepo.save(hwData);
			interaction.reply({
				embeds: [
					new MessageEmbed()
						.setTitle(`Set the current round to ${round}.`)
						.setColor(`#${client.config.defaultEmbedColor}`)
				],
				ephemeral: true
			});
		}
	}
};
export default interaction;