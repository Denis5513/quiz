"use client";

import { logout } from "@/actions/auth";
import { redirect } from "next/navigation";

export function LogoutForm() {
	return (
		<form
			action={async () => {
				await logout();
				redirect("/");
			}}
		>
			<button>Выход</button>
		</form>
	);
}
