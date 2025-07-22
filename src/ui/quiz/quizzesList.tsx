import urls from "@/config/urls";
import { Quiz } from "@/types/quiz";
import Link from "next/link";

export function QuizItem({ quiz }: { quiz: Quiz }) {
	return (
		<div>
			<h2>{quiz.title}</h2>

			<p>{quiz.description}</p>
		</div>
	);
}

export default function QuizzesList({ quizzes }: { quizzes: Quiz[] }) {
	return (
		<div>
			{quizzes.map((quiz) => (
				<Link href={urls.quiz(quiz.id)} key={quiz.id}>
					<QuizItem quiz={quiz} />
				</Link>
			))}
		</div>
	);
}
