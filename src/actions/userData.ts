"use server";

import * as db from "@/lib/database";
import { createAction, createSafeAction, LoggedSession } from "@/lib/wrappers";
import { IronSession } from "iron-session";
import { AuthError, TypedError } from "@/lib/error";
import { getSession } from "@/lib/auth";
import { SessionDataLogged } from "@/types/session";

export const changePremium = createSafeAction(async () => {
	const session = await getSession();
	if (!session.isLogged) {
		throw new AuthError();
	}

	const userId = session.userId;
	const newIsPro = await db.changePremium(null, userId);
	session.isPro = newIsPro;
	await session.save();
}, ["AUTH_ERROR"]);

export const changeUsername = createSafeAction(
	async (newName: string, session: LoggedSession) => {
		const client = await db.connect();

		try {
			const isExist = await db.checkUsername(client, newName);
			if (isExist) {
				throw new TypedError(
					"NAME_COLLISION",
					"User with this name already exist",
				);
			}
			const userId = session.userId;
			await db.changeUsername(client, userId, newName);

			session.username = newName;
			await session.save();

			return {
				newName,
			};
		} catch (err) {
			throw err;
		} finally {
			await db.disconnect(client);
		}
	},
	["NAME_COLLISION"],
);

export const createUser = createAction(
	async (username: string, password: string) => {
		const client = await db.connect();

		try {
			const isExist = await db.checkUsername(client, username);

			if (isExist) {
				throw new TypedError(
					"NAME_COLLISION",
					"User with this name already exist",
				);
			}

			const user = await db.createUser(client, username, password);
			const session = await getSession();
			const loggedSession = session as IronSession<SessionDataLogged>;

			loggedSession.isLogged = true;
			loggedSession.userId = user.id;
			loggedSession.isPro = user.isPro;
			loggedSession.username = user.username;

			await loggedSession.save();
		} catch (err) {
			throw err;
		} finally {
			db.disconnect(client);
		}
	},
	["NAME_COLLISION"],
);
