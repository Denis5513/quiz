"use client";

import React, { useEffect, useState } from "react";
import { RoundedShadowedBlock } from "./general";
import Link from "next/link";
import urls from "@/config/urls";
import publicUrl from "@/config/publicUrl";
import { LogoutForm } from "./forms/logoutForm";

const sideBarScreenWidth = 900;

export default function SideBar({
	username,
	className,
}: {
	username: string;
	className?: string;
}) {
	const [width, setWidth] = useState<number>(0);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	useEffect(() => {
		const handleResize = () => setWidth(() => window.innerWidth);
		handleResize();

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const url = publicUrl;

	return (
		<nav className={`grow ` + (className ?? "")}>
			{width >= sideBarScreenWidth ? (
				<div className="flex">
					<Link className="mr-[60px]" href={urls.home}>
						На главную
					</Link>
					<Link className="mr-auto" href={urls.profile}>
						Профиль
					</Link>

					<div className="flex items-center mr-[40px]">
						<img
							src={url + "/user_icon.svg"}
							alt=""
							className="mr-[20px]"
						/>
						<p>{username}</p>
					</div>
					<LogoutForm className="text-main-red"></LogoutForm>
				</div>
			) : (
				<div className="relative">
					<RoundedShadowedBlock
						className={`flex flex-col gap-[40px] w-[225px] p-[25px] fixed right-0 top-0 z-50
						 transition-transform duration-300 ease-in-out
						 ${isOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"}`}
					>
						<div className="flex items-center gap-[20px]">
							<button
								className="w-[20px] h-[20px] bg-center bg-no-repeat bg-cover cursor-pointer"
								style={{
									backgroundImage: `url(${url}/close.png)`,
								}}
								onClick={() => setIsOpen(() => false)}
							></button>
							<div className="flex items-center">
								<img
									src={url + "/user_icon.svg"}
									alt=""
									className="mr-[20px]"
								/>
								<p>{username}</p>
							</div>
						</div>
						<Link href={urls.home} onClick={() => setIsOpen(false)}>
							На главную
						</Link>
						<Link
							href={urls.profile}
							onClick={() => setIsOpen(false)}
						>
							Профиль
						</Link>
						<LogoutForm className="text-main-red"></LogoutForm>
					</RoundedShadowedBlock>

					<button
						className={`w-[30px] h-[30px] bg-center bg-no-repeat bg-cover fixed top-[25px] right-[25px] cursor-pointer`}
						style={{
							backgroundImage: `url(${url}/sidebar.png)`,
						}}
						onClick={() => setIsOpen(() => true)}
					></button>
				</div>
			)}
		</nav>
	);
}
