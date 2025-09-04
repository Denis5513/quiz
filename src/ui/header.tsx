import { getSession } from "@/lib/auth";
import Link from "next/link";
import urls from "@/config/urls";
import publicUrl from "@/config/publicUrl";
import SideBar from "./sideBar";

const headerTextStyle = "font-semibold text-xl";

export default async function Header({ className }: { className?: string }) {
	const session = await getSession();
	const url = publicUrl;

	return (
		<header
			className={
				`flex items-center px-full-page-block py-[16px] ` +
				(className ?? "")
			}
		>
			<p className="text-main font-semibold text-[28px] basis-[296px]">
				QuizMaster
			</p>

			{session.isLogged ? (
				<SideBar
					className={headerTextStyle}
					username={session.username}
				></SideBar>
			) : (
				<div className="ml-auto">
					<Link href={urls.login} className={headerTextStyle}>
						Войти
					</Link>
				</div>
			)}
		</header>
	);
}
