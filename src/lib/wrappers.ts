import {
	ActionReturn,
	BadActionReturn,
	GoodActionReturn,
} from "@/types/actionReturn";
import { ErrorTypes } from "@/types/error";
import { AuthError, DbError, TypedError } from "./error";
import { PoolClient } from "pg";

import { getSession } from "./auth";
import { SessionDataLogged } from "@/types/session";
import { IronSession } from "iron-session";

export type LoggedSession = IronSession<SessionDataLogged>;

export function createAction<TA extends any[], TR>(
	func: (...args: TA) => Promise<TR>,
	handledErrors?: Array<ErrorTypes | (string & {})>,
): (...args: TA) => Promise<ActionReturn<TR>> {
	const errorsSet = new Set(handledErrors);
	const wrapped = async (...args: TA) => {
		try {
			const result = await func(...args);
			return { success: true, result } as GoodActionReturn<TR>;
		} catch (err) {
			if (!(err instanceof TypedError)) {
				throw err;
			}
			if (errorsSet.has(err.type)) {
				return { success: false, error: err.type } as BadActionReturn;
			}
			throw err;
		}
	};

	return wrapped;
}

export function createSafeAction<TA extends any[], TR>(
	func: (...args: [...TA, LoggedSession]) => Promise<TR>,
	handledErrors?: Array<ErrorTypes | (string & {})>,
): (...args: TA) => Promise<ActionReturn<TR>> {
	const errorsSet = new Set(handledErrors);
	const wrapped = async (...args: TA) => {
		try {
			const session = await getSession();
			if (!session.isLogged) {
				throw new AuthError();
			}

			const result = await func(...args, session);
			return { success: true, result } as GoodActionReturn<TR>;
		} catch (err) {
			if (!(err instanceof TypedError)) {
				throw err;
			}
			if (errorsSet.has(err.type) || err.type === "AUTH_ERROR") {
				return { success: false, error: err.type } as BadActionReturn;
			}
			throw err;
		}
	};

	return wrapped;
}

export function dbConnectChecked<TA extends any[], TR>(
	func: (client: PoolClient, ...args: TA) => Promise<TR>,
	connect: () => Promise<PoolClient>,
	disconnect: (client: PoolClient) => Promise<void>,
) {
	const wrapped = async (client: PoolClient | null, ...args: TA) => {
		if (client !== null) {
			return await func(client, ...args);
		}

		client = await connect();
		try {
			const res = await func(client, ...args);
			return res;
		} catch (err) {
			if (err instanceof TypedError) {
				throw err;
			}
			throw new DbError();
		} finally {
			await disconnect(client);
		}
	};

	return wrapped;
}
