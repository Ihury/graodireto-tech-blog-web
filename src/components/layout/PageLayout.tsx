import { ReactNode } from "react";
import { Header } from ".";

interface PageLayoutProps {
	children: ReactNode;
	showAuthButton?: boolean;
	className?: string;
}

export default function PageLayout({
	children,
	showAuthButton = true,
	className = "min-h-screen bg-background",
}: PageLayoutProps) {
	return (
		<div className={className}>
			<Header showAuthButton={showAuthButton} />
			<div className="sm:px-4  lg:px-48">{children}</div>
		</div>
	);
}
