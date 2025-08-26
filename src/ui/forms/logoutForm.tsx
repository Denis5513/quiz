"use client";

import { logout } from "@/actions/auth";
import { redirect } from "next/navigation";

export function LogoutForm({ className }: { className?: string }) {
	return (
		<form
			action={async () => {
				await logout();
				redirect("/");
			}}
		>
			<button className={"cursor-pointer " + (className ?? "")}>
				Выход
			</button>
		</form>
	);
}
