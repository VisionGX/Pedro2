import { CommandInteraction, MessageEmbed } from "discord.js";
import Bot from "../../../Bot";
import MinecraftData from "../../../database/models/MinecraftData";
import MinecraftPlayer from "../../../database/models/MinecraftPlayer";
import { Interaction } from "../../../types/Executors";

const interaction: Interaction = {
	name: "mc users list",
	type: "SUB_FUNCTION",
	description: "List all Minecraft Users.",
	category: "config",
	internal_category: "sub",
	async execute(client: Bot, interaction: CommandInteraction) {
		const mcDataRepo = client.database.source.getRepository(MinecraftData);
		const mcData= await mcDataRepo.findOne({ where: { guildId: `${interaction.guildId}` } });
		if(!mcData) {
			interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setDescription("No Minecraft data found."),
				],
			});
			return;
		}
		const page = interaction.options.getInteger("page") ? (interaction.options.getInteger("page")!<1)? interaction.options.getInteger("page")! : 1 : 1;
		const mcUserRepo = client.database.source.getRepository(MinecraftPlayer);
		const mcUsers = await mcUserRepo.find({
			where: {
				data: mcData,
			},
		});
		// We trim the page to be 25 users per page.
		const trimmedUsers = mcUsers.slice((page - 1) * 25, page * 25);
		const embed = new MessageEmbed()
			.setColor(`#${client.config.defaultEmbedColor}`)
			.setTitle("Minecraft Users");
		trimmedUsers.forEach((user) => {
			embed.addField(user.name, `<@${user.userId}>`);
		});
		interaction.reply({
			embeds: [embed],
		});
	}
};
export default interaction;