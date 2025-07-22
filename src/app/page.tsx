import { getAllQuizzes } from "@/actions/quiz";
import QuizzesList from "@/ui/quiz/quizzesList";

export const revalidate = 3600;

export default async function Page() {
	const res = await getAllQuizzes();

	return (
		<div>
			<h1>Это домашняя страница (она видна всем)</h1>

			{res.success === true ? (
				<QuizzesList quizzes={res.result.quizzes} />
			) : (
				<p>Вам необходимо войти для прохождения квизов</p>
			)}
		</div>
	);
}
