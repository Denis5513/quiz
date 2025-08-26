import publicUrl from "@/config/publicUrl";
import { Quiz } from "@/types/quiz";
import Link from "next/link";
import React, { ComponentProps } from "react";

export function FormInput({
	isErr,
	...props
}: ComponentProps<"input"> & { isErr?: boolean }) {
	const classes = props.className ?? "";

	return (
		<input
			{...props}
			className={
				`block w-[100%] h-[49px] mt-[20px] text-[16px] border ${isErr ? "border-main-red" : "border-gray-300"} rounded-[8px] px-3 py-2 placeholder-gray-500 focus:outline-none ` +
				classes
			}
		/>
	);
}

export function Button(props: ComponentProps<"button">) {
	const classes = props.className ?? "";

	return (
		<button
			{...props}
			className={
				"block w-[100%] h-[55px] rounded-[8px] bg-main text-white cursor-pointer hover:bg-hover disabled:bg-secondary disabled:cursor-default " +
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
				"w-[100%] mh-[49px] leading-[49px] text-main-red bg-error-red rounded-[8px] text-center" +
				(className ?? "")
			}
		>
			{children}
		</p>
	);
}

export function AuthPageInfo({ children }: { children?: React.ReactNode }) {
	const url = publicUrl;

	return (
		<div
			className={`max-w-[1700px] flex flex-col gap-[100px] justify-between relative isolate
						2xl:flex-row 2xl:gap-[50px] 2xl:items-center`}
		>
			<div className={`relative h-full`}>
				<div
					className={`absolute w-[calc(100%_+_50px)] z-0 translate-pl-cancel h-[calc(100%_+_74px)] bg-main-bg translate-y-[-74px]
								lg:absolute lg:w-[1030px]`}
				></div>

				<div
					className={`relative z-1 mt-[86px] text-main text-center
								 lg:text-start`}
				>
					<h1
						className={`font-bold text-[40px] leading-[52px]
									lg:w-[645px]`}
					>
						Узнайте больше нового о себе и своих интересах
					</h1>

					<p
						className={`mt-[40px]
								   lg:w-[464px]`}
					>
						QuizMaster - это приложение для прохождения викторин.
						Проходите различные викторины, проверяйте свои знания и
						веселитесь!
					</p>

					<img
						src={url + "/quiz_taker.png"}
						alt="Happy quiz taker image"
						className={`mx-auto
									lg:ml-[172px]`}
					/>
				</div>
			</div>

			<div
				className={`mb-[100px]
							2xl:mb-0`}
			>
				{children}
			</div>
		</div>
	);
}

export function RoundedShadowedBlock({
	children,
	...props
}: ComponentProps<"div">) {
	return (
		<div
			{...props}
			className={
				`bg-form-main border-form-secondary border-[1px] rounded-[8px] shadow-xl ` +
				(props.className ?? "")
			}
		>
			{children}
		</div>
	);
}

export function RoundedVioletBlock({
	children,
	...props
}: ComponentProps<"div">) {
	return (
		<div
			{...props}
			className={`bg-main-bg rounded-[12px] ` + (props.className ?? "")}
		>
			{children}
		</div>
	);
}

export function QuizPreviewItem({
	quiz,
	className,
}: {
	quiz: Quiz;
	className?: string;
}) {
	return (
		<Link
			className={
				`flex flex-col grow min-w-[400px] h-[340px] p-[24px] bg-main-bg 
				 lg:grow-0 w-[400px] ` + (className ?? "")
			}
			href={`/quizzes/${quiz.id}`}
		>
			<h2 className={`mt-auto mb-[16px] font-bold text-[24px]`}>
				{quiz.title}
			</h2>
			<p className={``}>{quiz.description}</p>
		</Link>
	);
}

export function StyledRadioInput({
	className,
	...props
}: ComponentProps<"input">) {
	return (
		<div>
			<input type="radio" {...props} className="hidden" />
			<div
				className={
					`w-[21px] h-[21px] ml-[13px] rounded-full ${props.checked ? "border-5" : "border-2"} ` +
					(className ?? "")
				}
			/>
		</div>
	);
}

export function AnswerOption({
	isCorrect: answer,
	label: title,
	className,
	checked,
	onChange,
	name,
}: {
	label: string;
	isCorrect: boolean | null;
	className?: string;
	onChange: () => void;
	checked: boolean;
	name: string;
}) {
	return (
		<label
			className={
				`flex gap-[14px] items-center w-[339px] h-[55px] rounded-[8px] ${answer !== null ? (answer ? "bg-secondary-green" : "bg-secondary-red") : "bg-white"} ` +
				(className ?? "")
			}
		>
			<StyledRadioInput
				type="radio"
				checked={checked}
				onChange={onChange}
				name={name}
				className={`ml-[13px] ${answer !== null ? (answer ? "border-main-green" : "border-main-red") : "border-black"}`}
			/>
			<p className="font-semibold text-[20px]">{title}</p>
		</label>
	);
}
