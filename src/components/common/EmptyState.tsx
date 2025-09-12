import { ReactNode } from "react";

interface EmptyStateProps {
	title?: string;
	description: string;
	action?: ReactNode;
	icon?: ReactNode;
	className?: string;
}

export default function EmptyState({
	title,
	description,
	action,
	icon,
	className = "",
}: EmptyStateProps) {
	return (
		<div className={`text-center py-12 ${className}`}>
			{icon && <div className="flex justify-center mb-4">{icon}</div>}
			{title && (
				<h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
			)}
			<p className="text-gray-500 text-lg mb-6">{description}</p>
			{action && action}
		</div>
	);
}
