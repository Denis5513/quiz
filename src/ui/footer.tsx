export default function Footer({ className }: { className?: string }) {
	return (
		<footer
			className={
				`w-full h-[83px] px-[40px] py-[28px] text-black-secondary bg-footer-bg ` +
				(className ?? "")
			}
		>
			<p className="text-[20px] font-semibold">QuizMaster</p>
		</footer>
	);
}
