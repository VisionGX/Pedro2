import { Message } from "discord.js";
import Bot from "../../Bot";
import GuildData from "../../database/models/GuildData";

export default async (client: Bot, message: Message) => {
	if (message.author.bot) return;
	if (message.channel.type == "DM") return;
	const prefix = client.config.prefix;


	if (!message.content.startsWith(prefix)) return;

	if (!message.content) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const commandName = args.shift()?.toLowerCase();
	if (!commandName) return;
	const command = client.commands.get(commandName);
	if (!command) return;

	if (!message.guild) {
		try {
			command.execute(client, message, args, null);
		} catch (e) {
			console.error(e);
			message.reply("Ha ocurrido un error al ejecutar el comando.");
		}
	} else {
		const repo = client.database.source.getRepository(GuildData);
		let guildData = await repo.findOne({ where: { guildId: message.guild.id } });
		if (!guildData) {
			guildData = new GuildData();
			guildData.guildId = message.guild.id;
			await repo.save(guildData);
		}
		try {
			command.execute(client, message, args, guildData);
		} catch (e) {
			console.error(e);
			message.reply("Ha ocurrido un error al ejecutar el comando.");
		}
	}
};