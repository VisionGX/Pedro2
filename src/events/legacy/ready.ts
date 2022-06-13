import { ExcludeEnum } from "discord.js";
import { ActivityTypes } from "discord.js/typings/enums";
import Bot from "../../Bot";


export default async (client: Bot) => {
	console.log(`Ready as ${client.user.username}`, "App started");
	client.user.setActivity(`${client.config.activity.message}`, { type: `${client.config.activity.type}` as ExcludeEnum<typeof ActivityTypes, "CUSTOM"> });
};