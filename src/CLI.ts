import Express from "express";
import Bot from "./Bot";
import readline from "readline";
export interface Req<T> extends Express.Request {
	body: T
}
class CLI {
	client: Bot;
	private input : NodeJS.ReadableStream;
	private output : NodeJS.WritableStream;
	private interface :readline.Interface;
	constructor(client: Bot, output: NodeJS.WritableStream, input: NodeJS.ReadableStream) {
		this.client = client;
		this.input = input;
		this.output = output;
		this.interface = readline.createInterface({
			input: this.input,
			output: this.output,
			prompt: "> "
		});
		this.init();
	}
	init() {
		this.interface.on("line", (line) => {
			this.client.emit("cli", line);
		});
	}
}
export default CLI;