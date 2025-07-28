import { getAllQuizzes } from "@/actions/quiz";
import urls from "@/config/urls";
import { getSession } from "@/lib/auth";
import QuizzesList from "@/ui/quiz/quizzesList";
import { redirect } from "next/navigation";

export const revalidate = 3600;

export default async function Page() {
	const session = await getSession();
	if (!session.isLogged) {
		redirect(urls.login);
	}
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
