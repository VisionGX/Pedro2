import { GeneralContent, HandlerFunction, HandlerType } from "@garycraft/orizuru";
import Bot from "../../../Bot";
import { Handler } from "../../../types/Handler";
import MinecraftStatusMessage from "../../../database/models/MinecraftStatusMessage";
import MinecraftServer from "../../../database/models/MinecraftServer";
import { EmbedBuilder } from "discord.js";
import { createOrEditMessage } from "../../../util/Functions";
import { getStatusChannel } from "../../../util/MinecraftFunctions";


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
		const statusChannel = await getStatusChannel(client, data.body.id);
		if (!statusChannel) {
			return {
				body: data.body,
				err: false,
				code: 404,
				message: "Could not find status channel!"
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
		const latestTPS = data.body.args.tps[0];


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
					value: `${latestTPS < 12 ? ":red_circle: Malo" : latestTPS < 15 ? ":yellow_circle: Promedio" : latestTPS < 18 ? ":blue_circle: Bueno" : ":green_circle: Excelente"}`
				},
				{
					name: "Estado de Memoria",
					value: `Maximo: ${data.body.args.maxMemory}MB\nUsado: ${data.body.args.usedMemory}MB\nLibre: ${data.body.args.availableMemory}MB`
				},
				{
					name: "Estado de CPU",
					value: `Uso: ${data.body.args.cpuPercent.toFixed(2)} % del disponible`
				},
			])
			.setColor(`#${client.config.defaultEmbedColor}`)
			.setFooter({
				text: `Ultima Actualizacion: ${new Date().toLocaleString()}`
			});

		const message = await createOrEditMessage(statusChannel, embed, statusMessage.lastMessageId);
		if (!message) {
			return {
				body: data.body,
				err: false,
				code: 403,
				message: "Could not send Message!"
			}
		}
		statusMessage.lastMessageId = message.id;
		await statusMessageRepo.save(statusMessage);
		return {
			body: data.body,
			err: false,
			code: 200,
			message: "Performance Received"
		}
	}
}
export default handler;