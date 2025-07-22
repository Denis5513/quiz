"use client";

import { changePremium } from "@/actions/userData";
import { ActionReturn } from "@/types/action_return";
import { redirect } from "next/navigation";
import { useActionState, useEffect } from "react";

export default function ChangePremForm({ isPro }: { isPro: boolean }) {
	const [formState, formAction, isPending] =
		useActionState<ActionReturn<void> | null>(
			async () => await changePremium(),
			null,
		);

	useEffect(() => {
		if (formState?.success === false) {
			if (formState.error === "AUTH_ERROR") {
				alert(
					"Похоже ваша сессия истекла. Переходим на страницу входа.",
				);
				redirect("/login");
			}
		}
	}, [formState]);

	return (
		<form action={formAction}>
			<button type="submit" disabled={isPending}>
				{isPro ? "Отменить премиум" : "Купить премиум (0 руб)"}
			</button>
			{isPending && <p>Загрузка...</p>}
		</form>
	);
}
