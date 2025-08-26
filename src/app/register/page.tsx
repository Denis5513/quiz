import urls from "@/config/urls";
import RegisterForm from "@/ui/forms/registerForm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthPageInfo } from "@/ui/general";

export default async function Page() {
	const session = await getSession();
	if (session.isLogged) {
		redirect(urls.home);
	}

	return (
		<AuthPageInfo>
			<RegisterForm />
		</AuthPageInfo>
	);
}
