import { ArticleListItemResponseDto } from "@/types/techBlogApi";
import { ArticleCard } from ".";
import { LoadingSpinner, EmptyState } from "../../common";

interface ArticleListProps {
	articles: ArticleListItemResponseDto[];
	isLoading: boolean;
	onArticleClick: (article: ArticleListItemResponseDto) => void;
	onArticleEdit?: (article: ArticleListItemResponseDto) => void;
	currentUserId?: string;
	emptyMessage?: string;
	className?: string;
}

export default function ArticleList({
	articles,
	isLoading,
	onArticleClick,
	onArticleEdit,
	currentUserId,
	emptyMessage = "Nenhum artigo encontrado",
	className = "",
}: ArticleListProps) {
	if (isLoading) {
		return (
			<div className={`space-y-3 mb-6 ${className}`}>
				{Array.from({ length: 6 }).map((_, index) => (
					<div
						key={index}
						className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
					>
						<div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse" />
						<div className="flex-1">
							<div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
							<div className="h-3 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />
							<div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
						</div>
					</div>
				))}
			</div>
		);
	}

	if (articles.length === 0) {
		return <EmptyState description={emptyMessage} className={className} />;
	}

	return (
		<div className={`space-y-3 mb-6 ${className}`}>
			{articles.map((article) => (
				<div
					key={article.id}
					onClick={() => onArticleClick(article)}
					className="cursor-pointer"
				>
					<ArticleCard
						article={article}
						showEditButton={!!onArticleEdit}
						onEdit={onArticleEdit}
						currentUserId={currentUserId}
					/>
				</div>
			))}
		</div>
	);
}
