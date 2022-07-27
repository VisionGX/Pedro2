import Express from "express";
import { Req } from "../../API";
import Bot from "../../Bot";
import { APIFunction } from "../../types/Executors";
import { RequestContainer, ServerInfo } from "../../types/MinecraftPaperAPI";
const fn: APIFunction = {
	name: "Chat",
	async execute(_client: Bot, req: Req<RequestContainer<ServerInfo>>, res: Express.Response) {
		res.status(200).json({ body: req.body, err: false, code: 200, message: "Received!" });
	}
};
export default fn;