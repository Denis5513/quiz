"use client";

import useQuiz from "./useQuiz";

export default function Quiz({
	quizId,
	userId,
}: {
	quizId: number;
	userId: number;
}) {
	const quiz = useQuiz(quizId, userId);

	switch (quiz.status) {
		case "start":
			return (
				<div>
					{quiz.isPending ? (
						<p>Загрузка ...</p>
					) : (
						<div>
							<h2>Это квиз {quizId}</h2>
							{quiz.currentResult !== null ? (
								<div>
									<p>Вы уже начинали этот квиз</p>
									<button onClick={() => quiz.continueQuiz()}>
										Продолжить попытку?
									</button>
								</div>
							) : (
								<p>Вы ещё не проходили этот квиз</p>
							)}
							<button onClick={() => quiz.startNewQuiz()}>
								Начать новую попытку?
							</button>
						</div>
					)}
				</div>
			);

		case "question":
			return (
				<div>
					<h2>{quiz.question?.question}</h2>

					<ul>
						{quiz.question?.options.map((op, i) => (
							<li key={i} onClick={() => quiz.answer(i)}>
								{op}
							</li>
						))}
					</ul>
					<button
						disabled={quiz.answerInfo === null}
						onClick={() => quiz.next()}
					>
						Дальше
					</button>
					{quiz.isPending && <p>Загрузка ...</p>}
					{!quiz.isPending && quiz.answerInfo && (
						<p>
							Ваш ответ:{" "}
							{quiz.answerInfo.isCorrect ? "Верный" : "Неверный"}
						</p>
					)}
				</div>
			);

		case "result":
			return quiz.isPending ? (
				<p>Загрузка ...</p>
			) : (
				<div>
					<h2>Ваш результат: {quiz.currentResult?.result}</h2>{" "}
					<button onClick={() => quiz.startNewQuiz()}>
						Начать новую попытку?
					</button>
				</div>
			);

		default:
			break;
	}
}
