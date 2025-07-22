import { changeUsername } from "@/actions/userData";
import { getSession } from "@/lib/auth";
import ChangeUsernameForm from "@/ui/forms/changeUsernameForm";

export default async function Page() {
	const session = await getSession();

	return (
		<div>
			<h1>Это страница профиля</h1>
			{session.isLogged ? (
				<div>
					<p>Вы вошли как: {session.username}</p>
					<p>Изменение имени:</p>
					<ChangeUsernameForm
						changeNameAction={changeUsername}
						currentName={session.username}
					></ChangeUsernameForm>
				</div>
			) : (
				<p>Вам необходимо войти для просмотра профиля</p>
			)}
		</div>
	);
}
