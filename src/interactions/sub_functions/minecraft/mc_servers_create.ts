import { CommandInteraction, MessageEmbed } from "discord.js";
import Bot from "../../../Bot";
import MinecraftData from "../../../database/models/MinecraftData";
import MinecraftServer from "../../../database/models/MinecraftServer";
import { Interaction } from "../../../types/Executors";

const interaction: Interaction = {
	name: "mc servers create",
	type: "SUB_FUNCTION",
	description: "Create a Minecraft Server.",
	category: "config",
	internal_category: "sub",
	async execute(client: Bot, interaction: CommandInteraction) {
		const identifier = interaction.options.getString("identifier");
		const name = interaction.options.getString("name");

		if(!identifier) {
			interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setDescription("You must provide an identifier."),
				],
			});
			return;
		}
		if(!name) {
			interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setDescription("You must provide a name."),
				],
			});
			return;
		}
		const mcDataRepo = client.database.source.getRepository(MinecraftData);
		const mcData= await mcDataRepo.findOne({ where: { guildId: `${interaction.guildId}` } });
		if(!mcData) {
			interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setDescription("You must enable Minecraft Data first."),
				],
			});
			return;
		}
		const mcServerRepo = client.database.source.getRepository(MinecraftServer);
		const mcServer = await mcServerRepo.findOne({
			where: [
				{ identifier: identifier },
				{ serverName: name },
			]
		});
		if (mcServer) {
			interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setTitle("Server already exists.")
						.setDescription(
							`A server with the identifier ${identifier} or name ${name} already exists.`
						),
				],
			});
			return;
		}
		const newServer = await mcServerRepo.save({
			identifier: identifier,
			serverName: name,
			data: mcData,
		});
		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(`#${client.config.defaultEmbedColor}`)
					.setTitle("Server created.")
					.setDescription(
						`A server with the identifier ${newServer.identifier} and name ${newServer.serverName} has been created.`
					),
			],
		});
	}
};
export default interaction;
