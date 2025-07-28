"use client";

import { changeUsername } from "@/actions/userData";
import { authErrorHandler } from "@/lib/actionErrorHandler";
import { ActionReturn } from "@/types/action_return";
import { useActionState, useEffect, useState } from "react";

export default function ChangeUsernameForm({
	currentName,
}: {
	currentName: string;
}) {
	const [username, setUsername] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [formState, formAction, isPending] = useActionState<ActionReturn<{
		newName: string;
	}> | null>(async () => {
		const result = await changeUsername(username);
		return result;
	}, null);

	useEffect(() => {
		if (formState?.success === false) {
			switch (formState.error) {
				case "AUTH_ERROR":
					authErrorHandler();
				case "NAME_COLLISION":
					setErrorMessage("Это имя уже используется");
					break;
			}
		}
	}, [formState]);

	return (
		<div>
			<form
				action={() => {
					if (username !== currentName) {
						formAction();
					} else {
						setErrorMessage(
							"Новое имя должно отличатся от старого",
						);
					}
				}}
			>
				<p>Введите ваше новое имя: </p>
				<input
					type="text"
					placeholder="username"
					value={username}
					onChange={(e) => {
						setUsername(e.target.value);
						setErrorMessage(null);
					}}
					required
				/>
				<button type="submit" disabled={isPending}>
					Изменить
				</button>
			</form>
			{isPending && <p>Загрузка...</p>}
			{!isPending && formState && formState.success && (
				<p style={{ color: "green" }}>
					Ваше имя успешно заменено на {formState.result.newName}!
				</p>
			)}
			{!isPending && errorMessage && (
				<p style={{ color: "red" }}>{errorMessage}</p>
			)}
		</div>
	);
}
