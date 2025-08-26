"use client";

import urls from "@/config/urls";
import { redirect } from "next/navigation";

const AUTH_ERROR_MESSAGE =
	"Похоже ваша сессия истекла, перенаправляем на страницу авторизации";

export function authErrorHandler(): never {
	alert(AUTH_ERROR_MESSAGE);
	redirect(urls.login);
}
