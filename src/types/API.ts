import Bot from "../Bot";
import { Request } from "express";

interface ServerRequest extends Request {
	parentApp: Bot;
}

export { ServerRequest };