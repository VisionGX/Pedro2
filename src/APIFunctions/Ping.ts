import Express from "express";
import { Req } from "../API";
import Bot from "../Bot";
import { APIFunction } from "../types/Executors";
const fn: APIFunction = {
	name: "Chat",
	async execute(_client: Bot, req: Req<unknown>, res: Express.Response) {
		res.status(200).json({ body: req.body, err: false, code: 200, message: "Status Ok" });
	}
};
export default fn;