import { ExcludeEnum } from "discord.js";
import { ActivityTypes } from "discord.js/typings/enums";
import Bot from "../../Bot";


export default async (client: Bot) => {
	if (!client.user){
		client.logger.error("User is not defined");
		return;
	}
	client.logger.info("Logged in as " + client.user.tag);
	client.user.setActivity(`${client.config.activity.message}`, { type: `${client.config.activity.type}` as ExcludeEnum<typeof ActivityTypes, "CUSTOM"> });
};