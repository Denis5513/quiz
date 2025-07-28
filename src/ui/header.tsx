import { getSession } from "@/lib/auth";
import { LogoutForm } from "./forms/logoutForm";
import Link from "next/link";
import urls from "@/config/urls";
import publicUrl from "@/config/publicUrl";

const headerTextStyle = "font-semibold text-xl";

export default async function Header({ className }: { className?: string }) {
	const session = await getSession();
	const url = publicUrl;

	return (
		<header
			className={
				`flex items-center justify-between px-full-page-block py-[16px] ` +
				(className ?? "")
			}
		>
			<div className="flex items-center">
				<p className="text-main font-semibold text-[28px] mr-[140px]">
					QuizMaster
				</p>

				{session.isLogged && (
					<nav>
						<Link
							href={urls.home}
							className={headerTextStyle + " mr-[60px]"}
						>
							На главную
						</Link>
						<Link href={urls.profile} className={headerTextStyle}>
							Профиль
						</Link>
					</nav>
				)}
			</div>

			{session.isLogged ? (
				<div className="flex items-center">
					<div className="flex items-center mr-[40px]">
						<img
							src={url + "/user_icon.svg"}
							alt=""
							className="mr-[20px]"
						/>
						<p className={headerTextStyle}>{session.username}</p>
					</div>
					<LogoutForm
						className={headerTextStyle + " text-main-red"}
					></LogoutForm>
				</div>
			) : (
				<div>
					<Link href={urls.login} className={headerTextStyle}>
						Войти
					</Link>
				</div>
			)}
		</header>
	);
}
