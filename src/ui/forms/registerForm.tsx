"use client";

import { createUser } from "@/actions/userData";
import { redirect } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

export default function RegisterForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const [formState, formAction, isPending] = useActionState(async () => {
		return await createUser(username, password);
	}, null);

	useEffect(() => {
		if (formState?.success === true) {
			redirect("/");
		} else if (formState) {
			switch (formState.error) {
				case "NAME_COLLISION":
					setErrorMessage("Это имя уже используется");
					break;

				default:
					break;
			}
		}
	}, [formState]);

	return (
		<form action={formAction}>
			<div>
				<label>
					Username:
					<input
						type="text"
						name="username"
						value={username}
						required
						onChange={(e) => {
							setUsername(e.target.value);
							setErrorMessage(null);
						}}
					/>
				</label>
			</div>
			<div>
				<label>
					Password:
					<input
						type="password"
						name="password"
						value={password}
						required
						onChange={(e) => {
							setPassword(e.target.value);
							setErrorMessage(null);
						}}
					/>
				</label>
			</div>
			<button type="submit" disabled={isPending}>
				Register
			</button>
			{!isPending && errorMessage && (
				<p style={{ color: "red" }}>{errorMessage}</p>
			)}
		</form>
	);
}
