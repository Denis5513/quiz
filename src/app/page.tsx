import { getAllQuizzes } from "@/actions/quiz";
import urls from "@/config/urls";
import { getSession } from "@/lib/auth";
import { QuizPreviewItem } from "@/ui/general";
import { redirect } from "next/navigation";

export const revalidate = 3600;

export default async function Page() {
	const session = await getSession();
	if (!session.isLogged) {
		redirect(urls.login);
	}

	const res = await getAllQuizzes();
	if (res.success === false) {
		redirect(urls.login);
	}

	return (
		<div className="mt-[30px]">
			<div className="flex flex-wrap justify-center gap-[20px] mt-[20px]">
				{res.result.quizzes.map((quiz, id) => (
					<QuizPreviewItem quiz={quiz} key={id}></QuizPreviewItem>
				))}
			</div>
		</div>
	);
}
