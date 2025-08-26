"use client";

import { changeUsername } from "@/actions/userData";
import { authErrorHandler } from "@/lib/actionErrorHandlers";
import { ActionReturn } from "@/types/actionReturn";
import { useActionState, useEffect, useState } from "react";
import { Button, FormInput, RoundedVioletBlock } from "../general";

export default function ChangeUsernameForm({
	currentName,
	className,
}: {
	currentName: string;
	className?: string;
}) {
	const [username, setUsername] = useState<string>(currentName);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [formState, formAction, isPending] = useActionState<ActionReturn<{
		newName: string;
	}> | null>(async () => {
		if (currentName === username) {
			return { success: false, error: "CLIENT_UNCHANGED_NAME" };
		}

		const result = await changeUsername(username);
		return result;
	}, null);

	useEffect(() => {
		if (formState === null || formState.success === true) {
			setErrorMessage(() => null);
			return;
		}

		switch (formState.error) {
			case "AUTH_ERROR":
				authErrorHandler();

			case "NAME_COLLISION":
				setErrorMessage(() => "Это имя уже используется");
				break;

			case "CLIENT_UNCHANGED_NAME":
				setErrorMessage(() => "Новое имя должно отличаться от старого");
				break;
		}
	}, [formState]);

	return (
		<form action={formAction}>
			<RoundedVioletBlock
				className={
					`w-[360px] h-[460px] p-[32px] flex flex-col items-center ` +
					(className ?? "")
				}
			>
				<h1 className="text-[24px] font-bold font-inter">
					Ваш профиль
				</h1>

				<FormInput
					className="mt-[35px] bg-white text-center"
					value={username}
					onChange={(e) => {
						setUsername(() => e.target.value);
						setErrorMessage(() => null);
					}}
				/>

				<p
					className={`${errorMessage === null ? "text-secondary-text" : "text-main-red"} text-[16px] font-inter`}
				>
					{errorMessage === null ? "Измените ваше имя" : errorMessage}
				</p>

				<Button
					className="mt-auto"
					type="submit"
					disabled={isPending || errorMessage !== null}
				>
					Сохранить
				</Button>
			</RoundedVioletBlock>
		</form>
	);
}
