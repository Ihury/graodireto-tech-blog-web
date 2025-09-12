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
			<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<MagnifyingGlassIcon size={20} className="text-placeholder-text" />
			</div>
			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="
					w-full pl-10 pr-4 py-3 rounded-lg border-0
					bg-input-background text-foreground 
					placeholder-placeholder-text
					focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
					transition-colors
				"
			/>
		</div>
	);
}
