import { PageHeader } from "@/components/layout";
import { ArticleResponseDto } from "@/types/techBlogApi";
import { formatDate } from "@/utils/dateUtils";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { Button } from "../../ui";

interface ArticleHeaderProps {
	article: ArticleResponseDto;
	className?: string;
	showBackButton?: boolean;
	onBack?: () => void;
}

export default function ArticleHeader({
	article,
	className = "",
	showBackButton = false,
	onBack,
}: ArticleHeaderProps) {
	return (
		<header className={`mb-8 ${className}`}>
			<div className="flex items-center gap-4 mb-6">
				{showBackButton && (
					<Button variant="ghost" onClick={onBack} className="p-2">
						<ArrowLeftIcon size={20} weight="regular" />
					</Button>
				)}
				<h1 className="text-4xl md:text-5xl font-bold text-foreground">
					{article.title}
				</h1>
			</div>

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
