"use client";

import { usePathname } from "next/navigation";
import Footer from "@/ui/footer";
import urls from "@/config/urls";

const hideOn = [urls.login, urls.register];

export default function ConditionalFooter({
	className,
}: {
	className?: string;
}) {
	const pathname = usePathname();

	if (!pathname) return null;

	const shouldHide = hideOn.some(
		(p) => pathname === p || pathname.startsWith(p + "/"),
	);

	if (shouldHide) return null;

	return <Footer className={className} />;
}
