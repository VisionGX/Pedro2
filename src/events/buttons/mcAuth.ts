import { ButtonInteraction, MessageEmbed } from "discord.js";
import Bot from "../../Bot";
import MinecraftData from "../../database/models/MinecraftData";
import MinecraftPlayer from "../../database/models/MinecraftPlayer";

export default async (client: Bot, interaction: ButtonInteraction) => {
	const id = interaction.customId.split("|")[1];
	interaction.deferUpdate();

	const mcDataRepo = client.database.source.getRepository(MinecraftData);
	const mcUserRepo = client.database.source.getRepository(MinecraftPlayer);
	const mcData = await mcDataRepo.findOne({
		where: {
			guildId: `${interaction.guildId}`
		},
	});
	if (!mcData) return;
	const users = mcData.players;
	const user = users.find(p => p.uuid === id);
	if (!user) return;

	const embed = new MessageEmbed()
		.setTitle("Authorized!")
		.setDescription("Your new IP has been authorized.\nYou can now Login")
		.setColor(`#${client.config.defaultEmbedColor}`);

	await mcUserRepo.save({
		...user,
		enabled: true
	});
	if(interaction.message.type == "DEFAULT"){
		await interaction.message.delete().catch(()=>null);
	}
	
	await interaction.channel?.send({
		embeds: [embed],
	}).catch(() => null);
	
};