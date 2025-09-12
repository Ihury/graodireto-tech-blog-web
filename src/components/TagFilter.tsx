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
			<div className="flex gap-2 mb-6">
				{Array.from({ length: 5 }).map((_, index) => (
					<div
						key={index}
						className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse"
					/>
				))}
			</div>
		);
	}

	return (
		<div className="flex gap-2 mb-6 flex-wrap">
			{tags.map((tag) => {
				const isSelected = selectedTags.includes(tag.slug);
				return (
					<button
						key={tag.slug}
						onClick={() => onTagToggle(tag.slug)}
						className={`
							px-4 py-2 rounded-lg text-sm font-medium transition-colors
							${
								isSelected
									? "bg-input-background text-foreground"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
