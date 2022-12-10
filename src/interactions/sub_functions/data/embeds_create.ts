import { CommandInteraction, MessageEmbed } from "discord.js";
import Bot from "../../../Bot";
import GuildData from "../../../database/models/GuildData";
import GuildMessageEmbed from "../../../database/models/MessageEmbed";
import { Interaction } from "../../../types/Executors";

const interaction: Interaction = {
	name: "embeds create",
	type: "SUB_FUNCTION",
	description: "Create an embed message.",
	category: "data",
	internal_category: "sub",
	async execute(client: Bot, interaction: CommandInteraction) {
		const embedName = interaction.options.getString("name");
		if(!embedName) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("No message name provided")
					.setDescription("Please provide a name for the message.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		const guildDataRepo = client.database.source.getRepository(GuildData);
		const guildData = await guildDataRepo.findOne({ where: { guildId: interaction.guild?.id }, relations: ["embeds"] });
		if(!guildData) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Not initialized")
					.setDescription("This server has not been initialized yet. Please run /config init to initialize this server.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		const embedRepo = client.database.source.getRepository(GuildMessageEmbed);
		const embed = await embedRepo.findOne({ where: { name: embedName } });
		if(embed) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Message already exists")
					.setDescription("An embed with that name already exists, please choose a different name.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		const newEmbed = new GuildMessageEmbed();
		newEmbed.name = embedName;
		newEmbed.title = embedName;
		newEmbed.guildData = guildData;
		await embedRepo.save(newEmbed);
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Embed created")
					.setDescription(`An embed with the name **${embedName}** has been created.`)
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
	}
};
export default interaction;