export interface SessionDataLogged {
	userId: number;
	username: string;
	img: string;
	isPro: boolean;
	isLogged: true;
}

export interface SessionDataUnlogged {
	isLogged: false;
}

export type SessionData = SessionDataLogged | SessionDataUnlogged;
