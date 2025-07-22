import { ErrorTypes } from "@/types/error";

export class TypedError extends Error {
	constructor(
		public readonly type: ErrorTypes | (string & {}),
		message: string,
	) {
		super(message);
	}
}

export class AuthError extends TypedError {
	constructor(message: string = "User not authenticated") {
		super("AUTH_ERROR", message);
	}
}

export class DbError extends TypedError {
	constructor(message: string = "Database error") {
		super("DB_ERROR", message);
	}
}

export class QuizNotFoundError extends TypedError {
	constructor(message: string = "Quiz not found") {
		super("NOT_FOUND", message);
	}
}

export class ClientQuizError extends TypedError {
	constructor(message: string = "Client quiz error") {
		super("CLIENT_ERROR", message);
	}
}
