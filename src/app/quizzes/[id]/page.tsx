import { checkQuizIsExist } from "@/actions/quiz";
import urls from "@/config/urls";
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Quiz from "@/ui/quiz/quiz";

export default async function Page({
	params,
}: {
	params: Promise<{ id: number }>;
}) {
	const session = await getSession();
	if (!session.isLogged) {
		redirect(urls.home);
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
		<div>
			<h1>Это страница квиза {id}</h1>

			<Quiz quizId={id} userId={session.userId}></Quiz>
		</div>
	);
}
