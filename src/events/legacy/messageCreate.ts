import { Message } from "discord.js";
import Bot from "../../Bot";
import GuildData from "../../database/models/GuildData";

export default async (client: Bot, message:Message) => {
	if(message.author.bot) return;
	if(message.channel.type == "DM") return;
	const prefix = client.config.prefix;
	

	if(!message.content.startsWith(prefix)) return;
	
	if(!message.content)return;
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName);
	if(!command) return;
	const repo = await client.database.source.getRepository(GuildData);
	let guildData = await repo.findOne({ where: { id: message.guild.id } });
	if(!guildData) {
		guildData = new GuildData();
		guildData.id = message.guild.id;
		await repo.save(guildData);
	}
	try{
		command.execute(client, message, args, guildData);
	}catch(e){
		console.error(e);
		message.reply("Ha ocurrido un error al ejecutar el comando.");
	}
};