"use server";

import { Pool, PoolClient } from "pg";
import { User } from "@/types/global";
import { DbError, QuizNotFoundError, TypedError } from "./error";
import * as cr from "@/lib/crypted";
import {
	Question,
	QuestionBasic,
	Quiz,
	Result,
	UserAnswer,
} from "@/types/quiz";
import { dbConnectChecked } from "./wrappers";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false },
	max: 5,
	idleTimeoutMillis: 30000,
});

export async function connect(): Promise<PoolClient> {
	try {
		// console.log("Новое соединение с бд");
		return await pool.connect();
	} catch (err) {
		throw new DbError("DB connection error");
	}
}

export async function disconnect(client: PoolClient): Promise<void> {
	// console.log("Соединение закрыто");
	return await client.release();
}

export const checkUsername = dbConnectChecked(
	async (client, username: string) => {
		const res = await client.query(
			"SELECT 1 FROM users WHERE username = $1 LIMIT 1",
			[username],
		);
		return (res.rowCount ?? 0) > 0;
	},
	connect,
	disconnect,
);

export const getUser = dbConnectChecked(
	async (client, username: string) => {
		const res = await client.query<User>(
			`SELECT 
			  id, 
			  username, 
			  password_hashed AS "passwordHashed", 
			  is_pro AS "isPro", 
			  img
			FROM users
			WHERE username = $1`,
			[username],
		);
		const user = res.rows[0];
		return user || null;
	},
	connect,
	disconnect,
);

export const changePremium = dbConnectChecked(
	async (client, userId: number) => {
		const res = await client.query<{ is_pro: boolean }>(
			"UPDATE users SET is_pro = NOT is_pro WHERE id = $1 RETURNING is_pro",
			[userId],
		);

		const changedRows = res.rowCount;
		if (!changedRows || changedRows === 0) {
			throw new DbError(`Cannot change user ispro status`);
		}

		const newIsPro = res.rows[0].is_pro;
		return newIsPro;
	},
	connect,
	disconnect,
);

export const changeUsername = dbConnectChecked(
	async (client, userId: number, newName: string) => {
		const res = await client.query(
			"UPDATE users SET username = $1 WHERE id = $2",
			[newName, userId],
		);

		const rows = res.rowCount;
		if (!rows || rows < 1) {
			throw new DbError(`Cannot change username`);
		}
	},
	connect,
	disconnect,
);

export const createUser = dbConnectChecked(
	async (client, username: string, password: string) => {
		const passwordHashed = await cr.hash(password);

		const newUser = {
			isPro: false,
			passwordHashed,
			username,
		};

		const insertRes = await client.query<{ id: string }>(
			"INSERT INTO users (username, password_hashed, is_pro) VALUES ($1, $2, $3) RETURNING id;",
			[newUser.username, newUser.passwordHashed, newUser.isPro],
		);

		if (insertRes.rowCount !== 1) {
			throw new DbError("Failed to create user");
		}

		const id = Number(insertRes.rows[0].id);

		return { ...newUser, id } as User;
	},
	connect,
	disconnect,
);

export const getAllQuizzes = dbConnectChecked(
	async (client) => {
		const res = await client.query<Quiz>("SELECT * FROM quizzes");

		const quizes = res.rows;
		return quizes;
	},
	connect,
	disconnect,
);

export const getAllQuestions = dbConnectChecked(
	async (client, quizId: number) => {
		const res = await client.query<QuestionBasic>(
			"SELECT id, question from questions WHERE quiz_id = $1",
			[quizId],
		);

		if (res.rowCount === 0) {
			throw new QuizNotFoundError();
		}

		const questions = res.rows;
		const fullInfoQuestions = await Promise.all(
			questions.map<Promise<Question>>(async (question) => {
				const res = await client.query<{ answer: string }>(
					"SELECT answer FROM answers WHERE question_id = $1",
					[question.id],
				);
				return {
					...question,
					options: res.rows.map((item) => item.answer),
				};
			}),
		);

		const hasEmptyOptions = fullInfoQuestions.some(
			(q) => q.options.length === 0,
		);
		if (hasEmptyOptions) {
			throw new DbError("Some questions have no answer options");
		}

		return fullInfoQuestions;
	},
	connect,
	disconnect,
);

export const checkQuizIsExist = dbConnectChecked(
	async (client, quizId: number) => {
		const res = await client.query<{ id: number }>(
			"SELECT (id) FROM quizzes WHERE id = $1",
			[quizId],
		);
		return res.rowCount !== 0;
	},
	connect,
	disconnect,
);

export const createNewResult = dbConnectChecked(
	async (
		client,
		userId: number,
		quizId: number,
	): Promise<[number, UserAnswer[]]> => {
		const res = await client.query<{ id: number }>(
			`INSERT INTO results (user_id, quiz_id)
VALUES ($1, $2) RETURNING id`,
			[userId, quizId],
		);

		const res2 = await client.query<UserAnswer>(
			`INSERT INTO user_answers (result_id, question_id, answer_option, is_correct)
SELECT
    $1 AS result_id,
    q.id AS question_id,
    NULL AS answer_option,
    NULL AS is_correct
FROM questions q
WHERE q.quiz_id = $2
RETURNING id,
	result_id AS "resultId",
	question_id AS "questionId",
	answer_option AS "answerOption",
	is_correct AS "isCorrect"`,
			[res.rows[0].id, quizId],
		);

		return [res.rows[0].id, res2.rows];
	},
	connect,
	disconnect,
);

export const getResult = dbConnectChecked(
	async (client, userId: number, quizId: number) => {
		const res = await client.query<Result>(
			"SELECT * FROM results WHERE user_id = $1 AND quiz_id = $2",
			[userId, quizId],
		);
		if (res.rowCount === 0) return null;

		// Предполагаем, что result пока такой один
		return res.rows.at(-1)!; // <- возвращаем последний
	},
	connect,
	disconnect,
);

export const checkAnswer = dbConnectChecked(
	async (client, questionId: number, optionNumber: number) => {
		const res = await client.query<{ is_correct: boolean }>(
			`SELECT correct = $1 AS is_correct FROM questions WHERE id = $2`,
			[optionNumber, questionId],
		);

		if (res.rowCount === 0) {
			throw new TypedError(
				"NOT_FOUND",
				`There aren't a question with that id: ${questionId}`,
			);
		}

		return res.rows[0].is_correct;
	},
	connect,
	disconnect,
);

export const getUserAnswers = dbConnectChecked(
	async (client, resultId: number) => {
		const res = await client.query<UserAnswer>(
			`SELECT 
				result_id AS "resultId", 
				question_id AS "questionId", 
				answer_option AS "answerOption", 
				is_correct AS "isCorrect", 
				id
			FROM user_answers WHERE result_id = $1`,
			[resultId],
		);
		if (!res.rowCount) {
			throw new TypedError(
				"NOT_FOUND",
				`Not found user answers for result with id: ${resultId}`,
			);
		}

		return res.rows;
	},
	connect,
	disconnect,
);

export const writeAnswer = dbConnectChecked(
	async (client, ans: UserAnswer) => {
		const res = await client.query(
			`UPDATE user_answers SET answer_option = $1, is_correct = $2 WHERE id = $3;`,
			[ans.answerOption, ans.isCorrect, ans.id],
		);

		if (res.rowCount === 0) {
			throw new TypedError("NOT_FOUND", "No userAnswer with that id");
		}
	},
	connect,
	disconnect,
);

export const getResultScore = dbConnectChecked(
	async (client, resultId: number) => {
		const userAnswers = await getUserAnswers(client, resultId);

		for (const ans of userAnswers) {
			if (ans.answerOption === null) return null;
		}

		const answers = userAnswers.length;
		const right = userAnswers.reduce(
			(sum, item) => sum + +item.isCorrect!,
			0,
		);

		return { answers, right };
	},
	connect,
	disconnect,
);

export const setResultScore = dbConnectChecked(
	async (client, resultId: number, score: string) => {
		const res = await client.query(
			`UPDATE results SET is_finished = true, result = $1 WHERE id = $2`,
			[score, resultId],
		);

		if (!res.rowCount) {
			throw new DbError(
				`Cannot update result score with id: ${resultId}`,
			);
		}
	},
	connect,
	disconnect,
);

export const deleteResult = dbConnectChecked(
	async (client, resultId: number) => {
		const res = await client.query(`DELETE FROM results WHERE id = $1`, [
			resultId,
		]);

		if (res.rowCount !== 1) {
			throw new DbError(`Can't delete result with id: ${resultId}`);
		}
	},
	connect,
	disconnect,
);

export const userAnswerIsExist = dbConnectChecked(
	async (client, userAnswerId: number) => {
		const res = await client.query(
			`SELECT (id) FROM user_answers WHERE id = $1 AND answer_option IS NOT NULL`,
			[userAnswerId],
		);

		return res.rowCount !== 0;
	},
	connect,
	disconnect,
);
