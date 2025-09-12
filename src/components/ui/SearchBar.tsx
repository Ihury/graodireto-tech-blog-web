import { MagnifyingGlassIcon } from "@phosphor-icons/react";

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
}

export default function SearchBar({
	value,
	onChange,
	placeholder = "Pesquisar...",
	className = "",
}: SearchBarProps) {
	return (
		<div className={`relative ${className}`}>
			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="
					w-full p-4 rounded-lg border-0
					bg-input-background text-foreground
					placeholder-placeholder-text
					focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
					transition-colors
				"
			/>
		</div>
	);
}
