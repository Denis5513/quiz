"use server";

import { createSafeAction } from "@/lib/wrappers";
import * as db from "@/lib/database";
import { TypedError } from "@/lib/error";
import { UserAnswer, UserAnswerFromClient } from "@/types/quiz";
import { SessionDataLogged } from "@/types/session";

export const getAllQuizzes = createSafeAction(async () => {
	const quizzes = await db.getAllQuizzes(null);
	return {
		quizzes,
	};
});

export const getAllQuestions = createSafeAction(
	async (quizId: number, session: SessionDataLogged) => {
		const questions = await db.getAllQuestions(null, quizId);
		return {
			questions,
		};
	},
	["NOT_FOUND"],
);

export const checkQuizIsExist = createSafeAction(
	async (quizId: number, session: SessionDataLogged) => {
		const isExist = await db.checkQuizIsExist(null, quizId);
		return {
			isExist,
		};
	},
);

export const startNewQuiz = createSafeAction(
	async (
		quizId: number,
		oldResultId: number | undefined,
		session: SessionDataLogged,
	) => {
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
);

export const checkResultExist = createSafeAction(
	async (quizId: number, session: SessionDataLogged) => {
		return await db.getResult(null, session.userId, quizId);
	},
);

export const continueQuiz = createSafeAction(
	async (quizId: number, resultId: number, session: SessionDataLogged) => {
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
);

export const answer = createSafeAction(
	async (ans: UserAnswerFromClient, session: SessionDataLogged) => {
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
);

export const getResult = createSafeAction(
	async (quizId: number, session: SessionDataLogged) => {
		const result = await db.getResult(null, session.userId, quizId);
		return result;
	},
);

export const getQuiz = createSafeAction(
	async (quizId: number, session: SessionDataLogged) => {
		const quiz = await db.getQuiz(null, quizId);
		return quiz;
	},
	["NOT_FOUND"],
);
