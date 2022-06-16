import { Interaction } from "discord.js";
import Bot from "../../Bot";
import GuildData from "../../database/models/GuildData";

export default async (client: Bot, interaction:Interaction) => {
	if(interaction.isButton()) return client.emit("buttonInteraction", interaction);
	if(interaction.isSelectMenu()) return client.emit("menuInteraction", interaction);
	if(interaction.isContextMenu() || interaction.isCommand()){
		const inter = client.interactions.get(interaction.commandName.replace(/\s/g, "_"));
		if(!inter) return client.logger.warn("Command not found", interaction.commandName);
		if(!interaction.guild){
			inter.execute(client, interaction, null);
			return;
		} else {
			const repo = client.database.source.getRepository(GuildData);
			let guildData = await repo.findOne({ where: { guildId: interaction.guild.id } });
			if (!guildData) {
				guildData = new GuildData();
				guildData.guildId = interaction.guild.id;
				await repo.save(guildData);
			}
			try {
				inter.execute(client, interaction, guildData);
			} catch (e) {
				client.logger.error(e as Error);
				interaction.reply({content:"An error happened executing this interaction.", ephemeral:true});
			}
		}
	}
};
