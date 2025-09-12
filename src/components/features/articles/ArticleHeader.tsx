import { ArticleResponseDto } from "@/types/techBlogApi";
import { formatDate } from "@/utils/dateUtils";

interface ArticleHeaderProps {
	article: ArticleResponseDto;
	className?: string;
}

export default function ArticleHeader({
	article,
	className = "",
}: ArticleHeaderProps) {
	return (
		<header className={`mb-8 ${className}`}>
			<h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
				{article.title}
			</h1>

			<div className="flex items-center text-gray-600 text-sm mb-4">
				<span>Publicado por {article.author.displayName}</span>
				<span className="mx-2">•</span>
				<span>{formatDate(article.createdAt)}</span>
			</div>

			<div className="flex items-center gap-2 mb-6">
				{article.tags.map((tag) => (
					<span
						key={tag.slug}
						className="px-3 py-1 text-sm font-medium bg-input-background text-foreground rounded-full"
					>
						{tag.name}
					</span>
				))}
			</div>
		</header>
	);
}
