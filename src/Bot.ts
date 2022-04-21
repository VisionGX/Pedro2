import { Client, Collection, Intents } from "discord.js";
import { Command } from "./types/Command";
import * as fs from "fs";
import SPDatabase from "./database";

type BotConfig = {
	prefix: string;
	token: string;
	admins: string[];
	activity: {
		message: string;
		type: string;
	};
	embedColor: string;
};

class Bot extends Client {
	config: BotConfig;
	commands: Collection<string, Command>;
	database: SPDatabase;
 	constructor() {
		super({
			intents:  [
				Intents.FLAGS.GUILDS, 
				Intents.FLAGS.GUILD_MEMBERS, 
				Intents.FLAGS.GUILD_MESSAGES, 
				Intents.FLAGS.GUILD_INVITES, 
				Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, 
				Intents.FLAGS.GUILD_VOICE_STATES,
			]
		});
		this.commands = new Collection();
		this.config = require("../config");
		this.database = new SPDatabase();
  	}
	async registerEvents() {
		fs.readdirSync(`${__dirname}/events`).forEach(dir => {
			fs.readdirSync(`${__dirname}/events/${dir}`).forEach(file => {
				const event = require(`./events/${dir}/${file}`).default;
				console.log(`Loading Event ${file}`);
				this.on(file.split(".")[0], event.bind(null, this));
			});
		});
  	}
	async loadCommands() {
		fs.readdirSync(`${__dirname}/commands`).forEach(dir => {
			fs.readdirSync(`${__dirname}/commands/${dir}`).forEach(file => {
				const command: Command = require(`./commands/${dir}/${file}`).default;
				console.log(`Loading Command ${file}`);
				this.commands.set(command.name, command);
			});
		});
  	}
	async start(){
		await this.database.init();
		await this.registerEvents();
		await this.loadCommands();
		await this.login(this.config.token);
	}
}
export default Bot;

