"use server";

import { createAction } from "@/lib/wrappers";
import * as db from "@/lib/database";
import { AuthError, TypedError } from "@/lib/error";
import { getSession } from "@/lib/auth";
import { UserAnswer, UserAnswerFromClient } from "@/types/quiz";

export const getAllQuizzes = createAction(async () => {
	const session = await getSession();
	if (!session.isLogged) {
		throw new AuthError();
	}

	const quizzes = await db.getAllQuizzes(null);
	return {
		quizzes,
	};
}, ["AUTH_ERROR"]);

export const getAllQuestions = createAction(
	async (quizId: number) => {
		const session = await getSession();
		if (!session.isLogged) {
			throw new AuthError();
		}

		const questions = await db.getAllQuestions(null, quizId);
		return {
			questions,
		};
	},
	["NOT_FOUND", "AUTH_ERROR"],
);

export const checkQuizIsExist = createAction(
	async (quizId: number) => {
		const isExist = await db.checkQuizIsExist(null, quizId);

		return {
			isExist,
		};
	},
	["AUTH_ERROR"],
);

export const startNewQuiz = createAction(
	async (quizId: number, oldResultId?: number) => {
		const session = await getSession();
		if (!session.isLogged) {
			throw new AuthError();
		}

		const client = await db.connect();
		try {
			if (oldResultId !== undefined) {
				await db.deleteResult(client, oldResultId);
			}

			const [resultId, userAnswers] = await db.createNewResult(
				client,
				session.userId,
				quizId,
			);
			const questions = await db.getAllQuestions(client, quizId);

			return { userAnswers, questions, resultId };
		} catch (err) {
			throw err;
		} finally {
			await db.disconnect(client);
		}
	},
	["AuthError"],
);

export const checkResultExist = createAction(
	async (quizId: number) => {
		const session = await getSession();
		if (!session.isLogged) {
			throw new AuthError();
		}

		return await db.getResult(null, session.userId, quizId);
	},
	["AUTH_ERROR"],
);

export const continueQuiz = createAction(
	async (quizId: number, resultId: number) => {
		const session = await getSession();
		if (!session.isLogged) {
			throw new AuthError();
		}

		const client = await db.connect();
		try {
			const userAnswers = await db.getUserAnswers(client, resultId);

			const questions = await db.getAllQuestions(client, quizId);

			return {
				userAnswers,
				questions,
			};
		} catch (err) {
			throw err;
		} finally {
			await db.disconnect(client);
		}
	},
	["AUTH_ERROR"],
);

export const answer = createAction(
	async (ans: UserAnswerFromClient) => {
		const session = await getSession();
		if (!session.isLogged) {
			throw new AuthError();
		}

		const client = await db.connect();
		try {
			const answerIsExist = await db.userAnswerIsExist(client, ans.id);
			if (answerIsExist) {
				throw new TypedError(
					"ANSWER_COLLISION",
					`Question ${ans.questionId} have already been answered`,
				);
			}

			const isCorrect = await db.checkAnswer(
				client,
				ans.questionId,
				ans.answerOption,
			);
			const userAnswer: UserAnswer = { ...ans, isCorrect };

			await db.writeAnswer(client, userAnswer);

			const scoreInf = await db.getResultScore(client, ans.resultId);
			if (scoreInf === null) {
				return {
					isCorrect,
					scoreInf: null,
				};
			}

			const score = `${scoreInf.right} / ${scoreInf.answers}`;
			await db.setResultScore(client, ans.resultId, score);

			return {
				isCorrect,
				scoreInf,
			};
		} catch (err) {
			throw err;
		} finally {
			await db.disconnect(client);
		}
	},
	["AUTH_ERROR"],
);

export const getResult = createAction(
	async (quizId: number) => {
		const session = await getSession();
		if (!session.isLogged) {
			throw new AuthError();
		}

		const result = db.getResult(null, session.userId, quizId);
		return result;
	},
	["AUTH_ERROR"],
);
