"use client";

import { login } from "@/actions/auth";
import urls from "@/config/urls";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ActionReturn } from "@/types/action_return";
import { AuthForm } from "./authForm";

function processActionResult(
	res: ActionReturn<void>,
	setErr: (err: string | null) => void,
) {
	if (res.success) {
		redirect(urls.home);
	}
	if (res.error === "AUTH_ERROR") {
		setErr("Неправильный логин или пароль");
	}
}

export default function LoginForm({ className }: { className?: string }) {
	return (
		<AuthForm
			className={className}
			title="Вход"
			submitButtonTitle="Войти"
			processActionResult={processActionResult}
			action={login}
		>
			<p className="text-[16px] my-[20px]">
				Нет аккаунта?{" "}
				<Link href={urls.register} className="text-main cursor-pointer">
					Регистрация
				</Link>
			</p>
		</AuthForm>
	);
}
