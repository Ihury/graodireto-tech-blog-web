interface TagProps {
	name: string;
	slug: string;
	variant?: "default" | "small";
	className?: string;
}

export default function Tag({
	name,
	slug,
	variant = "default",
	className = "",
}: TagProps) {
	const baseClasses =
		"px-2 text-sm font-medium bg-input-background text-foreground rounded-full";
	const smallClasses =
		"px-2 text-xs font-medium bg-input-background text-foreground rounded-full";

	const classes = variant === "small" ? smallClasses : baseClasses;

	return <span className={`${classes} ${className}`}>{name}</span>;
}
