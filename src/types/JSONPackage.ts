type JSONPackage = {
	name?: string;
	version?: string;
	description?: string;
	main?: string;
	author?: string;
	license?: string;
	dependencies?: {
		[key: string]: string;
	};
	devDependencies?: {
		[key: string]: string;
	};
	scripts?: {
		[key: string]: string;
	};
	repository?: {
		type?: string;
		url?: string;
	};
	bugs?: {
		url?: string;
	};
	homepage?: string;
	engines?: {
		node?: string;
	};
}
export { JSONPackage };