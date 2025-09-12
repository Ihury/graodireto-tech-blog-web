import { ReactNode } from "react";
import { Button } from "../ui";

interface ErrorStateProps {
	title?: string;
	message: string;
	action?: ReactNode;
	onRetry?: () => void;
	className?: string;
}

export default function ErrorState({
	title = "Algo deu errado",
	message,
	action,
	onRetry,
	className = "",
}: ErrorStateProps) {
	return (
		<div className={`text-center py-12 ${className}`}>
			<h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
			<p className="text-gray-600 mb-6">{message}</p>
			<div className="flex justify-center gap-4">
				{onRetry && (
					<Button onClick={onRetry} variant="secondary">
						Tentar novamente
					</Button>
				)}
				{action}
			</div>
		</div>
	);
}
