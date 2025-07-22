import { getSession } from "@/lib/auth";
import ChangePremForm from "@/ui/forms/changePremForm";
import { redirect } from "next/navigation";

export default async function Page() {
	const session = await getSession();
	if (!session.isLogged) {
		redirect("/login");
	}

	return (
		<div>
			<h1>Это страница премиума</h1>
			<p>
				{session.isPro
					? "Вы премиум пользователь"
					: "Вы пока не премиум пользователь"}
			</p>
			<ChangePremForm isPro={session.isPro}></ChangePremForm>
		</div>
	);
}
