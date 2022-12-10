
interface RequestContainer<T> {
	content: string;
	content_type: string;
	args: T;
	id: string;
}

interface ServerInfo {
	serverName: string;
	serverVersion: string;
	serverMotd: string;
	serverMaxPlayers: number;
	serverIP: string;
	serverPort: number;
	pluginVersion: string;
}
interface PlayerInfo {
	name: string;
	uuid: string;
	ip: string;
}
interface EventInfo {
	location: string;
	entity: PlayerInfo;
	eventName: string;
}
interface ServerStats {
	online: number;
	max: number;
	tps: number;
	memory: number;
	cpu: number;
	uptime: number;
	pluginVersion: string;
}
interface ServerPlayerStats {
	online: number;
	max: number;
}

interface PlayerAuthArgs { player: PlayerInfo }
interface PlayerJoinArgs { player: PlayerInfo, server: ServerPlayerStats, event: EventInfo }
interface PlayerLeaveArgs { player: PlayerInfo, server: ServerPlayerStats, event: EventInfo }

export { RequestContainer,ServerInfo, PlayerInfo, EventInfo, ServerStats, ServerPlayerStats, PlayerAuthArgs, PlayerJoinArgs, PlayerLeaveArgs };