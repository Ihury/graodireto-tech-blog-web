import { ReactNode } from "react";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { Button } from "../ui";

interface PageHeaderProps {
	title: string;
	subtitle?: string;
	action?: ReactNode;
	showBackButton?: boolean;
	onBack?: () => void;
	className?: string;
}

export default function PageHeader({
	title,
	subtitle,
	action,
	showBackButton = false,
	onBack,
	className = "",
}: PageHeaderProps) {
	return (
		<div className={`flex justify-between items-center mb-8 ${className}`}>
			<div className="flex items-center gap-4">
				{showBackButton && (
					<Button variant="ghost" onClick={onBack} className="p-2">
						<ArrowLeftIcon size={20} weight="regular" />
					</Button>
				)}
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						{title}
					</h1>
					{subtitle && (
						<p className="text-gray-600 mt-1">{subtitle}</p>
					)}
				</div>
			</div>
			{action && <div>{action}</div>}
		</div>
	);
}
