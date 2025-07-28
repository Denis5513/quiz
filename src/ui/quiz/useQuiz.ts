"use client";

import {
	Question,
	Result,
	UserAnswer,
	UserAnswerFromClient,
} from "@/types/quiz";
import { useEffect, useRef, useState } from "react";
import * as ac from "@/actions/quiz";
import { ClientQuizError } from "@/lib/error";
import { BadActionReturn, GoodActionReturn } from "@/types/action_return";
import { authErrorHandler } from "@/lib/actionErrorHandler";

interface QuizState {
	isPending: boolean;
	status: "start" | "question" | "result";
	question: Question | null;
	answerInfo: {
		answerOption: number;
		isCorrect: boolean;
	} | null;
	currentResult: Result | null;

	startNewQuiz: () => void;
	continueQuiz: () => void;
	answer: (answerOption: number) => void;
	next: () => void;
}

function handleErr(res: BadActionReturn) {
	switch (res.error) {
		case "AUTH_ERROR":
			authErrorHandler();

		default:
			console.error(`Internal server error: ${res.error}`);
	}
}

function assertUserAnswers(
	val: UserAnswer[] | null,
): asserts val is UserAnswer[] {
	if (!val) {
		throw new ClientQuizError("No one quiz is started");
	}
}

function assertQuestions(val: Question[] | null): asserts val is Question[] {
	if (!val) {
		throw new ClientQuizError("No one quiz is started");
	}
}

function assertResult(result: Result | null): asserts result is Result {
	if (result === null) {
		throw new ClientQuizError("Result id is unknown");
	}
}

export default function useQuiz(quizId: number, userId: number): QuizState {
	const [status, setStatus] = useState<QuizState["status"]>("start");
	const [isPending, setPenging] = useState<QuizState["isPending"]>(true);
	const [answerInfo, setAnswerInfo] = useState<QuizState["answerInfo"]>(null);
	const [question, setQuestion] = useState<Question | null>(null);
	const currentResult = useRef<Result | null>(null);

	const currentQuestion = useRef<number>(0);
	const questions = useRef<Question[] | null>(null);
	const userAnswers = useRef<UserAnswer[] | null>(null);

	async function initQuizState() {
		const res = await ac.getResult(quizId);
		if (res.success === false) {
			handleErr(res);
			return;
		}

		currentResult.current = res.result;
		if (currentResult.current?.is_finished) {
			setStatus(() => "result");
		} else {
			setStatus(() => "start");
		}
		setPenging(() => false);
	}

	function saveQuizInfo(
		res: GoodActionReturn<{
			userAnswers: UserAnswer[];
			questions: Question[];
		}>,
	) {
		questions.current = res.result.questions;

		const userAnswersByQuestionId = Object.fromEntries(
			res.result.userAnswers.map((ua) => [ua.questionId, ua]),
		);
		userAnswers.current = Array.from(
			questions.current,
			({ id }) => userAnswersByQuestionId[id],
		);

		assertQuestions(questions.current);
		assertUserAnswers(userAnswers.current);
	}

	function startNewQuiz() {
		setPenging(() => true);
		ac.startNewQuiz(quizId, currentResult.current?.id)
			.then((res) => {
				if (res.success === false) {
					handleErr(res);
					return;
				}

				saveQuizInfo(res);
				currentQuestion.current = 0;
				currentResult.current = {
					id: res.result.resultId,
					is_finished: false,
					quizId,
					userId,
					result: null,
				};

				setStatus(() => "question");
				setQuestion(() => questions.current![currentQuestion.current]);
			})
			.finally(() => setPenging(() => false));
	}

	function continueQuiz() {
		setPenging(() => true);
		assertResult(currentResult.current);
		ac.continueQuiz(quizId, currentResult.current.id)
			.then((res) => {
				if (res.success === false) {
					handleErr(res);
					return;
				}

				saveQuizInfo(res);
				currentQuestion.current = userAnswers.current!.findIndex(
					(ua) => ua.answerOption === null,
				);
				if (currentQuestion.current === -1) {
					throw new ClientQuizError("Quiz have already finished");
				}

				setStatus(() => "question");
				setQuestion(() => questions.current![currentQuestion.current]);
			})
			.finally(() => setPenging(() => false));
	}

	function answer(answerOption: number) {
		assertUserAnswers(userAnswers.current);
		assertQuestions(questions.current);
		const userAnswerInfo = userAnswers.current[currentQuestion.current];
		const ans: UserAnswerFromClient = {
			answerOption,
			id: userAnswerInfo.id,
			questionId: userAnswerInfo.questionId,
			resultId: userAnswerInfo.resultId,
		};

		setPenging(() => true);
		ac.answer(ans)
			.then((res) => {
				if (res.success === false) {
					handleErr(res);
					return;
				}

				const { isCorrect, scoreInf } = res.result;

				setAnswerInfo(() => ({
					answerOption,
					isCorrect,
				}));

				if (scoreInf !== null) {
					assertResult(currentResult.current);
					currentResult.current.is_finished = true;
					currentResult.current.result = `${scoreInf.right} / ${scoreInf.answers}`;
				}
			})
			.finally(() => setPenging(() => false));
	}

	function next() {
		assertResult(currentResult.current);
		if (currentResult.current.is_finished) {
			setStatus(() => "result");
			return;
		}

		++currentQuestion.current;
		setQuestion(() => {
			assertQuestions(questions.current);
			return questions.current[currentQuestion.current];
		});
		setAnswerInfo(() => null);
	}

	useEffect(() => {
		initQuizState();
	}, []);

	return {
		status,
		question,
		currentResult: currentResult.current,
		isPending,
		answerInfo,
		answer,
		continueQuiz,
		next,
		startNewQuiz,
	};
}
