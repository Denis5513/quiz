import { checkQuizIsExist } from "@/actions/quiz";
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Quiz from "@/ui/quiz/quiz";
import urls from "@/config/urls";

export default async function Page({
	params,
}: {
	params: Promise<{ id: number }>;
}) {
	const session = await getSession();
	if (!session.isLogged) {
		redirect(urls.login);
	}

	const id = Number((await params).id);
	const responce = await checkQuizIsExist(id);
	if (responce.success === true) {
		const isExist = responce.result.isExist;

		if (!isExist) {
			notFound();
		}
	}

	return (
		<div className="w-full my-auto">
			<Quiz
				quizId={id}
				userId={session.userId}
				className="mx-auto"
			></Quiz>
		</div>
	);
}
