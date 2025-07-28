import urls from "@/config/urls";
import { getSession } from "@/lib/auth";
import LoginForm from "@/ui/forms/loginForm";
import { AuthPageInfo } from "@/ui/general";
import { redirect } from "next/navigation";

export default async function Page() {
	const session = await getSession();
	if (session.isLogged) {
		redirect(urls.home);
	}

	return (
		<AuthPageInfo width={930}>
			<LoginForm />
		</AuthPageInfo>
	);
}
