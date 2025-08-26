"use client";

import { useState } from "react";
import { AnswerOption, Button, RoundedVioletBlock } from "../general";
import useQuiz, { QuizInterface } from "./useQuiz";
import { ClientQuizError } from "@/lib/error";
import publicUrl from "@/config/publicUrl";
import { redirect } from "next/navigation";
import urls from "@/config/urls";

function QuizFormBlock({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<RoundedVioletBlock
			className={
				`flex flex-col max-w-[754px] min-h-[492px] p-[32px] 
				 3xl:max-w-[962px] ` + (className ?? "")
			}
		>
			{children}
		</RoundedVioletBlock>
	);
}

function StartQuizForm({
	quiz,
	className,
}: {
	quiz: QuizInterface;
	className?: string;
}) {
	return (
		<QuizFormBlock className={` ` + (className ?? "")}>
			{!quiz.isPending && (
				<div className="flex flex-col items-center gap-[20px] mt-[50px]">
					<h2 className="text-[28px] font-bold mb-[12px]">
						{quiz.quizInfo!.title}
					</h2>

					{quiz.currentResult !== null ? (
						<p className="text-[20px] text-black-secondary mb-[24px]">
							Вы уже начинали этот квиз
						</p>
					) : (
						<p className="text-[20px] text-black-secondary mb-[24px]">
							Вы ещё не проходили этот квиз
						</p>
					)}

					<div className="flex flex-wrap gap-[16px] w-full justify-center">
						{quiz.currentResult !== null && (
							<Button
								className="w-[245px]"
								onClick={() => quiz.continueQuiz()}
							>
								Продолжить попытку
							</Button>
						)}

						<Button
							className="w-[245px]"
							onClick={() => quiz.startNewQuiz()}
						>
							Начать новую попытку
						</Button>
					</div>
				</div>
			)}
		</QuizFormBlock>
	);
}

function QuestionQuizForm({
	quiz,
	className,
}: {
	quiz: QuizInterface;
	className?: string;
}) {
	const [ansOption, setAnsOption] = useState<null | number>(null);

	return (
		<QuizFormBlock className={` ` + (className ?? "")}>
			<h2 className="mb-[36px] font-bold text-[28px]">
				{quiz.question?.question}
			</h2>

			<div className="flex flex-wrap gap-[12px]">
				{quiz.question?.options.map((option, id) => (
					<AnswerOption
						key={id}
						checked={ansOption === id}
						label={option}
						name="answers"
						onChange={() => {
							if (ansOption !== null) return;
							setAnsOption(() => id);
							quiz.answer(id);
						}}
						isCorrect={
							quiz.answerInfo?.answerOption === id
								? quiz.answerInfo.isCorrect
								: null
						}
						className="shrink-0 grow-1"
					/>
				))}
			</div>

			<div className="flex items-center justify-between mt-[147px]">
				<p className="text-[20px] text-black-secondary font-inter font-bold">
					Вопрос: {quiz.questionInfo.currentQuestion + 1}/
					{quiz.questionInfo.questionsNumber}
				</p>

				<Button
					disabled={quiz.answerInfo === null}
					className="w-[245px]"
					onClick={() => {
						quiz.next();
						setAnsOption(() => null);
					}}
				>
					Дальше
				</Button>
			</div>
		</QuizFormBlock>
	);
}

function ResultQuizForm({
	quiz,
	className,
}: {
	quiz: QuizInterface;
	className?: string;
}) {
	const result = quiz.currentResult?.result?.split("/").map(Number);
	if (!result) {
		throw new ClientQuizError("Result is indefined");
	}

	const [right, all] = result.map(Number);
	const percentage = (right / all) * 100;

	const url = publicUrl;

	return (
		<QuizFormBlock
			className={`items-center gap-[8px] ` + (className ?? "")}
		>
			<img src={`${url}/result.png`} className="w-[622px]" />

			<h1 className="mt-[20px] text-[48px] font-inter font-semibold text-main">
				{percentage}%
			</h1>

			<h2 className="text-[28px] font-semibold">
				{percentage >= 80
					? "Отличный результат!"
					: percentage > 50
						? "Неплохой результат"
						: "Ваш результат"}
			</h2>

			<p className="text-[20px] font-semibold">
				Вы ответили правильно на {right} из {all} вопросов.
			</p>

			<div className="mt-[20px] w-full flex items-center justify-around">
				<Button
					disabled={quiz.isPending}
					onClick={() => redirect(urls.home)}
					className="w-[245px]"
				>
					На главную
				</Button>
				<Button
					disabled={quiz.isPending}
					className="w-[245px]"
					onClick={() => quiz.startNewQuiz()}
				>
					Начать новую попытку
				</Button>
			</div>
		</QuizFormBlock>
	);
}

export default function Quiz({
	quizId,
	userId,
	className,
}: {
	quizId: number;
	userId: number;
	className?: string;
}) {
	const quiz = useQuiz(quizId, userId);

	switch (quiz.status) {
		case "start":
			return <StartQuizForm quiz={quiz} className={className} />;

		case "question":
			return <QuestionQuizForm quiz={quiz} className={className} />;

		case "result":
			return <ResultQuizForm quiz={quiz} className={className} />;

		default:
			break;
	}
}
