import { IdErrorType } from "./error";

export interface ActionReturnType {
	success: boolean;
	error?: IdErrorType;
}

// Database type
export interface User {
	id: number;
	username: string;
	passwordHashed: string;
	isPro: boolean;
	img?: string;
}
