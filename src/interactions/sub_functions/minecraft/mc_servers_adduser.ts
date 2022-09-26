import { CommandInteraction, MessageEmbed } from "discord.js";
import Bot from "../../../Bot";
import MinecraftData from "../../../database/models/MinecraftData";
import MinecraftPlayer from "../../../database/models/MinecraftPlayer";
import MinecraftServer from "../../../database/models/MinecraftServer";
import MinecraftServerPlayer from "../../../database/models/MinecraftServerPlayer";
import { Interaction } from "../../../types/Executors";

const interaction: Interaction = {
	name: "mc servers adduser",
	type: "SUB_FUNCTION",
	description: "Add a user to a Minecraft Server.",
	category: "config",
	internal_category: "sub",
	async execute(client: Bot, interaction: CommandInteraction) {
		const name = interaction.options.getString("name");
		const discord_user = interaction.options.getUser("user");

		if(!name) {
			interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setDescription("You must provide a server name."),
				],
			});
			return;
		}
		if(!discord_user) {
			interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setDescription("You must provide an user."),
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
				{ serverName: name },
			],
		});
		if (!mcServer) {
			interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setTitle("Server does not exist.")
						.setDescription(
							`A server with the name ${name} does not exist.`
						),
				],
			});
			return;
		}
		const mcUserRepo = client.database.source.getRepository(MinecraftPlayer);
		const mcPlayer = await mcUserRepo.findOne({
			where: [
				{ userId: `${discord_user.id}` },
			]
		});
		if (!mcPlayer) {
			interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setTitle("User does not exist.")
						.setDescription(
							`A user with the name ${discord_user.tag} does not exist.`
						),
				],
			});
			return;
		}
		const mcUser = new MinecraftServerPlayer();
		mcUser.server = mcServer;
		mcUser.player = mcPlayer;
		mcServer.players.push(mcUser);
		await mcServerRepo.save(mcServer);
		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(`#${client.config.defaultEmbedColor}`)
					.setTitle("User added.")
					.setDescription(
						`The user <@${discord_user.id}> (${mcPlayer.name}) has been added to the server ${mcServer.serverName}.`
					),
			],
		});
	}
};
export default interaction;