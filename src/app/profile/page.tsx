import urls from "@/config/urls";
import { getSession } from "@/lib/auth";
import ChangeUsernameForm from "@/ui/forms/changeUsernameForm";
import { redirect } from "next/navigation";

export default async function Page() {
	const session = await getSession();
	if (!session.isLogged) {
		redirect(urls.login);
	}

	return (
		<div className="w-full my-auto">
			<ChangeUsernameForm
				className="mx-auto"
				currentName={session.username}
			></ChangeUsernameForm>
		</div>
	);
}
