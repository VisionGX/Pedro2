import { GeneralContent, HandlerFunction, HandlerType } from "@garycraft/orizuru";
import Bot from "../../../Bot";
import { Handler } from "../../../types/Handler";
import MinecraftStatusMessage from "../../../database/models/MinecraftStatusMessage";
import MinecraftServer from "../../../database/models/MinecraftServer";
import { EmbedBuilder } from "discord.js";


const handler: Handler<HandlerFunction<Bot, "Performance">> = {
	type: "Performance",
	run: async (client, data) => {
		const statusMessageRepo = client.database.source.getRepository(MinecraftStatusMessage);
		const statusMessage = await statusMessageRepo.findOne({
			where: {
				serverIdentifier: data.body.id
			}
		});
		if (!statusMessage) {
			return {
				body: data.body,
				err: false,
				code: 200,
				message: "Performance Received"
			}
		}
		const guildId = statusMessage.guildId;
		const channelId = statusMessage.channelId;
		if (!guildId || !channelId) {
			return {
				body: data.body,
				err: false,
				code: 404,
				message: "Empty guildId or channelId"
			};
		}
		const guild = client.guilds.cache.get(guildId) || await client.guilds.fetch(guildId).catch(() => null);
		if (!guild) {
			return {
				body: data.body,
				err: false,
				code: 404,
				message: "Guild not found!"
			};
		}
		const channel = guild.channels.cache.get(channelId) || await guild.channels.fetch(channelId).catch(() => null);
		if (!channel || !channel.isTextBased()) {
			return {
				body: data.body,
				err: false,
				code: 404,
				message: "Channel not found!"
			}
		}
		const minecraftServerRepo = client.database.source.getRepository(MinecraftServer);
		const minecraftServer = await minecraftServerRepo.findOne({
			where: {
				identifier: data.body.id
			}
		});
		if (!minecraftServer) {
			return {
				body: data.body,
				err: false,
				code: 404,
				message: "Minecraft Server not found!"
			}
		}
		const avgTPS = data.body.args.tps.reduce((a, b) => a + b, 0) / data.body.args.tps.length;


		const embed = new EmbedBuilder()
			.setTitle(`Rendimiento del Servidor de Minecraft!`)
			.setDescription(`Servidor En Linea: :green_circle: Si`)
			.addFields([
				{
					name: "Nombre del Servidor",
					value: `${minecraftServer.serverName || "Unknown"}`
				},
				{
					name: "Jugadores Conectados",
					value: `${data.body.args.players.online}/${data.body.args.players.max}`
				},
				{
					name: "Estado de Rendimiento",
					// Based on average TPS from array, if les than 12, is bad, if it's less than 15, it's avg, if it's less than 18, it's okay, if it's less than 20, it's good
					value: `${avgTPS < 12 ? ":red_circle: Malo" : avgTPS < 15 ? ":yellow_circle: Promedio" : avgTPS < 18 ? ":blue_circle: Bueno" : ":green_circle: Excelente"}`
				},
				{
					name: "Estado de Memoria",
					value: `Maximo: ${data.body.args.maxMemory}MB\nUsado: ${data.body.args.usedMemory}MB\nLibre: ${data.body.args.availableMemory}MB`
				},
				{
					name: "Estado de CPU",
					value: `Uso: ${data.body.args.cpuPercent} % del disponible`
				},
			])
			.setColor(`#${client.config.defaultEmbedColor}`)
			.setFooter({
				text: `Ultima Actualizacion: ${new Date().toLocaleString()}`
			});

		if (!statusMessage.lastMessageId) {
			const newMessage = await channel.send({
				embeds: [embed]
			}).catch(() => null);
			if (!newMessage) {
				return {
					body: data.body,
					err: false,
					code: 500,
					message: "Error sending message"
				}
			}
			statusMessage.lastMessageId = newMessage.id;
			await statusMessageRepo.save(statusMessage);
		} else {
			const lastMessage = channel.messages.cache.get(statusMessage.lastMessageId) || await channel.messages.fetch(statusMessage.lastMessageId).catch(() => null);
			if (!lastMessage) {
				const newMessage = await channel.send({
					embeds: [embed]
				}).catch(() => null);
				if (!newMessage) {
					return {
						body: data.body,
						err: false,
						code: 500,
						message: "Error sending message"
					}
				}
				statusMessage.lastMessageId = newMessage.id;
				await statusMessageRepo.save(statusMessage);
			}
			else {
				await lastMessage.edit({
					embeds: [embed]
				}).catch(() => null);
			}
		}
		return {
			body: data.body,
			err: false,
			code: 200,
			message: "Performance Received"
		}
	}
}
export default handler;