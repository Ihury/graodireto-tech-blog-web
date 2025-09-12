import { useEffect, useState } from "react";

export interface ToastProps {
	message: string;
	type: "success" | "error" | "info" | "warning";
	duration?: number;
	onClose?: () => void;
}

export default function Toast({
	message,
	type,
	duration = 5000,
	onClose,
}: ToastProps) {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
			setTimeout(() => onClose?.(), 300); // Aguarda a animação de saída
		}, duration);

		return () => clearTimeout(timer);
	}, [duration, onClose]);

	const handleClose = () => {
		setIsVisible(false);
		setTimeout(() => onClose?.(), 300);
	};

	const typeStyles = {
		success: "bg-green-50 border-green-200 text-green-800",
		error: "bg-red-50 border-red-200 text-red-800",
		info: "bg-blue-50 border-blue-200 text-blue-800",
		warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
	};

	const iconStyles = {
		success: "text-green-400",
		error: "text-red-400",
		info: "text-blue-400",
		warning: "text-yellow-400",
	};

	const icons = {
		success: "✓",
		error: "✕",
		info: "ℹ",
		warning: "⚠",
	};

	return (
		<div
			className={`
				fixed top-4 right-4 z-50 max-w-sm w-full
				border rounded-lg shadow-lg p-4
				transform transition-all duration-300 ease-in-out
				${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
				${typeStyles[type]}
			`}
		>
			<div className="flex items-start">
				<div className={`flex-shrink-0 text-lg ${iconStyles[type]}`}>
					{icons[type]}
				</div>
				<div className="ml-3 flex-1">
					<p className="text-sm font-medium">{message}</p>
				</div>
				<button
					onClick={handleClose}
					className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600"
				>
					<span className="sr-only">Fechar</span>
					<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clipRule="evenodd"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
}
