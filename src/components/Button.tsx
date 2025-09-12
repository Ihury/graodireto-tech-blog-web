import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	variant?: "primary" | "secondary";
	size?: "sm" | "md" | "lg";
	fullWidth?: boolean;
}

export default function Button({
	children,
	variant = "primary",
	size = "md",
	fullWidth = false,
	className = "",
	...props
}: ButtonProps) {
	const baseClasses =
		"font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

	const variantClasses = {
		primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary",
		secondary:
			"bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
	};

	const sizeClasses = {
		sm: "px-4 py-2 text-sm",
		md: "px-6 py-3 text-base",
		lg: "px-8 py-4 text-lg",
	};

	const widthClasses = fullWidth ? "w-full" : "";

	return (
		<button
			className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
}
