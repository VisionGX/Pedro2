import { MessageReaction, User } from "discord.js";
import Bot from "../../Bot";

export default async (client: Bot, reaction: MessageReaction, user: User) => {
	client.emit("suggestionReact", { reaction, user });
};