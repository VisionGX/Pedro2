import { Response } from "express";
import { ServerRequest } from "../types/API";
export default {
	async get(_req:ServerRequest, res: Response) {
		res.redirect("/index.html");
	},
};