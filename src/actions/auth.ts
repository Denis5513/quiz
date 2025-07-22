"use server";

import { getSession } from "@/lib/auth";
import { SessionDataLogged } from "@/types/session";
import { IronSession } from "iron-session";
import * as db from "@/lib/database";
import * as cr from "@/lib/crypted";
import { createAction } from "@/lib/wrappers";
import { AuthError } from "@/lib/error";

export const login = createAction(
	async (username: string, password: string) => {
		const session = await getSession();

		const user = await db.getUser(null, username);
		if (!user) {
			throw new AuthError();
		}
		const isEquial = await cr.compare(password, user.passwordHashed);
		if (!isEquial) {
			throw new AuthError();
		}

		session.isLogged = true;
		const loggedSession = session as IronSession<SessionDataLogged>;
		loggedSession.userId = user.id;
		loggedSession.isPro = user.isPro;
		loggedSession.username = user.username;

		await loggedSession.save();
	},
	["AUTH_ERROR"],
);

export async function logout(): Promise<void> {
	const session = await getSession();
	session.destroy();
}
