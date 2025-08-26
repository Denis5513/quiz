"use client";

import { createUser } from "@/actions/userData";
import urls from "@/config/urls";
import { ActionReturn } from "@/types/actionReturn";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AuthForm } from "./authForm";

function processActionResult(
	res: ActionReturn<void>,
	setErr: (err: string | null) => void,
) {
	if (res.success) {
		redirect(urls.home);
	}
	if (res.error === "NAME_COLLISION") {
		setErr("Это имя уже используется");
	}
}

export default function RegisterForm() {
	return (
		<AuthForm
			title={"Регистрация"}
			submitButtonTitle={"Зарегистрироваться"}
			action={createUser}
			processActionResult={processActionResult}
		>
			<p className="text-[16px] my-[20px]">
				Уже есть аккаунт?{" "}
				<Link href={urls.login} className="text-main cursor-pointer">
					Вход
				</Link>
			</p>
		</AuthForm>
	);
}
