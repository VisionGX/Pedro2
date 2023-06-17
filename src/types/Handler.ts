import { HandlerFunction, HandlerType } from "@garycraft/orizuru/lib/types/Handlers";
import Bot from "../Bot";

interface Handler<F extends HandlerFunction<Bot, HandlerType>> {
	type: HandlerType;
	run: F;
}

export { Handler };