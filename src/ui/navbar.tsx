import Link from "next/link";
import { LogoutForm } from "./forms/logoutForm";
import { getSession } from "@/lib/auth";
import urls from "@/config/urls";

export async function Nav() {
	const session = await getSession();

	return (
		<nav>
			<Link href={urls.home}>Домой</Link>
			<Link href={urls.profile}>Профиль</Link>
			<Link href={urls.premium}>Премиум</Link>
			{!session.isLogged && <Link href={urls.login}>Вход</Link>}
			{!session.isLogged && <Link href={urls.register}>Регистрация</Link>}
			{session.isLogged && <LogoutForm></LogoutForm>}
		</nav>
	);
}
