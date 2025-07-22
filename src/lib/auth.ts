import { SessionData, SessionDataUnlogged } from "@/types/session";
import { getIronSession, IronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export const sessionOptions: SessionOptions = {
	password: process.env.SECRET_KEY!,
	cookieName: "quiz-session",
	cookieOptions: {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
	},
};

export const defaultSession: SessionDataUnlogged = {
	isLogged: false,
};

export async function getSession(): Promise<IronSession<SessionData>> {
	"use server";
	const cookieStore = await cookies();
	const session = await getIronSession<SessionData>(
		cookieStore,
		sessionOptions,
	);
	if (!session.isLogged) {
		session.isLogged = defaultSession.isLogged;
	}
	return session;
}
