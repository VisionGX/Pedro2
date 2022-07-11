import { MessageAttachment, MessageContextMenuInteraction, MessageEmbed } from "discord.js";
import Bot from "../../Bot";
import GuildData from "../../database/models/GuildData";
import { Interaction } from "../../types/Executors";
const interaction:Interaction = {
	name: "send to museum",
	type: "MESSAGE",
	description: "Sends a message with attachments to the museum",
	category: "other",
	internal_category: "guild",
	async execute(client:Bot, interaction:MessageContextMenuInteraction) {
		if (
			!interaction.memberPermissions?.has("MANAGE_GUILD") &&
			!interaction.memberPermissions?.has("ADMINISTRATOR") &&
			!client.config.admins.includes(interaction.user.id)
		) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("You do not have permission to use this command.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		const guildDataRepo = client.database.source.getRepository(GuildData);
		const guildData = await guildDataRepo.findOne({
			where: {
				guildId: `${interaction.guild?.id}`,
			},
		});
		if (!guildData || !guildData.museumId) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Museum Channel is not configured in this server.")
					.setDescription("Administrators can enable it with `/config museum`.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		const targetMessage = await interaction.channel?.messages.fetch(interaction.targetMessage.id);
		const msgAttachments = targetMessage?.attachments;
		if (!msgAttachments) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("No Attachments found!")
					.setDescription("This message has no attachments.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		let attachments: MessageAttachment[] | undefined = [];
		if (msgAttachments.size){
			for await (const [, attachment] of msgAttachments) {
				attachments.push(attachment);
			}
		}
		attachments = attachments.length > 0 ? attachments : undefined;
		if (!attachments) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("No Attachments found!")
					.setDescription("This message has no attachments.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		const channel = client.channels.cache.get(`${guildData.museumId}`) || await client.channels.fetch(`${guildData.museumId}`).catch(() => null);
		if (!channel || !channel.isText()) return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Museum Channel is not configured in this server or is not valid.")
					.setDescription("Administrators can enable it with `/config museum`.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		const content = targetMessage?.content || "";
		const embeds : MessageEmbed[] = [];
		for (const attachment of attachments) {
			embeds.push(new MessageEmbed()
				.setAuthor({name: targetMessage?.author?.tag, iconURL: targetMessage?.author?.displayAvatarURL()})
				.setDescription(`${content}`)
				.setColor(`#${client.config.defaultEmbedColor}`)
				.setImage(attachment.proxyURL)
			);
		}
		await channel.send({embeds}).catch(() => null);
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Message sent to Museum!")
					.setDescription("The message has been sent to the museum.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		
	}
};
export default interaction;