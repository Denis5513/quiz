import publicUrl from "@/config/publicUrl";
import React, { ComponentProps } from "react";

export function FormInput({
	isErr,
	...props
}: ComponentProps<"input"> & { isErr?: boolean }) {
	return (
		<input
			{...props}
			className={`block w-[100%] h-[49px] mt-[20px] text-[16px] border ${isErr ? "border-main-red" : "border-gray-300"} rounded-[8px] px-3 py-2 placeholder-gray-500 focus:outline-none`}
		/>
	);
}

export function Button(props: ComponentProps<"button">) {
	const classes = props.className ?? "";

	return (
		<button
			{...props}
			className={
				"block w-[100%] h-[55px] mt-[40px] rounded-[8px] bg-main text-white cursor-pointer hover:bg-hover disabled:bg-secondary disabled:cursor-default " +
				classes
			}
		>
			{props.children}
		</button>
	);
}

export function ErrorMessage({
	className,
	children,
}: {
	className?: string;
	children: string;
}) {
	return (
		<p
			className={
				"w-[100%] mh-[49px] leading-[49px] text-main-red bg-secondary-red rounded-[8px] text-center" +
				(className ?? "")
			}
		>
			{children}
		</p>
	);
}

export function AuthPageInfo({
	children,
	width,
}: {
	children?: React.ReactNode;
	width?: number;
}) {
	const url = publicUrl;

	return (
		<div
			className={`flex flex-col gap-[100px] justify-between items-center px-full-page-block relative isolate
						2xl:flex-row`}
		>
			<div
				className={`relative h-[100%] before:absolute before:z-0 before:block before:content-[''] before-translate-x-cancel-px before:translate-y-[-74px] before:w-[1030px] before:h-[100vh] before:bg-main-bg
							`}
			>
				<div
					className={`relative w-[${width}px] z-1 mt-[86px] text-main`}
				>
					<h1 className="w-[645px] font-bold text-[40px] leading-[52px]">
						Узнайте больше нового о себе и своих интересах
					</h1>

					<p className="w-[464px] mt-[40px]">
						QuizMaster - это приложение для прохождения викторин.
						Проходите различные викторины, проверяйте свои знания и
						веселитесь!
					</p>

					<img
						src={url + "/quiz_taker.png"}
						alt="Happy quiz taker image"
						className="relative left-[172px]"
					/>
				</div>
			</div>

			<div className="grow mx-auto">{children}</div>
		</div>
	);
}

/* 	before:left-1/2 before:-translate-x-1/2
	2xl:before:left-[-100px] 2xl:before:-translate-x-0 */
