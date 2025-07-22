"use client";

import { login } from "@/actions/auth";
import urls from "@/config/urls";
import { redirect } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

export default function LoginForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const [formState, formAction, isPending] = useActionState(async () => {
		return await login(username, password);
	}, null);

	useEffect(() => {
		if (formState?.success === true) {
			redirect(urls.home);
		} else {
			if (formState?.error === "AUTH_ERROR") {
				setErrorMessage("Неправильный логин или пароль");
			}
		}
	}, [formState]);

	return (
		<form action={formAction}>
			<input
				type="text"
				name="username"
				required
				placeholder="username"
				onChange={(e) => {
					setUsername(e.target.value);
					setErrorMessage(null);
				}}
			/>
			<input
				type="password"
				name="password"
				required
				placeholder="password"
				onChange={(e) => {
					setPassword(e.target.value);
					setErrorMessage(null);
				}}
			/>
			<button type="submit" disabled={isPending}>
				Login
			</button>
			{isPending && <p>Загрузка...</p>}
			{errorMessage && (
				<p style={{ color: "red" }}>Неправильный логин или пароль</p>
			)}
		</form>
	);
}
