import { TagDto } from "@/types/techBlogApi";

interface TagFilterProps {
	tags: TagDto[];
	selectedTags: string[];
	onTagToggle: (tagSlug: string) => void;
	isLoading?: boolean;
}

export default function TagFilter({
	tags,
	selectedTags,
	onTagToggle,
	isLoading = false,
}: TagFilterProps) {
	if (isLoading) {
		return (
			<div className="flex gap-2 mb-4">
				{Array.from({ length: 8 }).map((_, index) => (
					<div
						key={index}
						className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"
					/>
				))}
			</div>
		);
	}

	return (
		<div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
			{tags.map((tag) => {
				const isSelected = selectedTags.includes(tag.slug);
				return (
					<button
						key={tag.slug}
						onClick={() => onTagToggle(tag.slug)}
						className={`
							px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0
							${
								isSelected
									? "bg-primary/[20%] text-primary"
									: "bg-input-background text-foreground hover:bg-primary/[20%] hover:text-primary"
							}
						`}
					>
						{tag.name}
					</button>
				);
			})}
		</div>
	);
}
