"use client";

import { ActionReturn } from "@/types/actionReturn";
import { useState, useActionState, useEffect } from "react";
import { ErrorMessage, FormInput, Button } from "../general";

interface AuthFormProps {
	title: string;
	submitButtonTitle: string;
	className?: string;
	children?: React.ReactNode;
	action: (username: string, password: string) => Promise<ActionReturn<void>>;
	processActionResult: (
		res: ActionReturn<void>,
		setError: (err: string | null) => void,
	) => void;
}

export function AuthForm(props: AuthFormProps) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const [formState, formAction, isPending] = useActionState(async () => {
		return await props.action(username, password);
	}, null);

	useEffect(() => {
		if (formState !== null) {
			props.processActionResult(formState, setErrorMessage);
		}
	}, [formState]);

	return (
		<form
			action={formAction}
			className={
				"max-w-[500px] mh-[410px] mx-auto px-[32px] pt-[40px] pb-[60px] bg-form-main border-form-secondary border-[1px] rounded-[8px] shadow-xl " +
				(props.className ?? "")
			}
		>
			<h2 className="font-noto-sans text-[32px] leanding-[32px] font-bold">
				{props.title}
			</h2>

			{props.children}

			{errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

			<FormInput
				type="text"
				required
				placeholder="Логин"
				value={username}
				isErr={!!errorMessage}
				onChange={(e) => {
					setUsername(e.target.value);
					setErrorMessage(null);
				}}
			/>
			<FormInput
				type="password"
				required
				placeholder="Пароль"
				value={password}
				isErr={!!errorMessage}
				onChange={(e) => {
					setPassword(e.target.value);
					setErrorMessage(null);
				}}
			/>

			<Button
				type="submit"
				disabled={
					isPending ||
					errorMessage !== null ||
					username === "" ||
					password === ""
				}
				className="mt-[40px]"
			>
				{props.submitButtonTitle}
			</Button>
		</form>
	);
}
