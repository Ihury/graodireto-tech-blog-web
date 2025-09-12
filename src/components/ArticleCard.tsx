import { PencilSimpleIcon } from "@phosphor-icons/react";
import { ArticleListItemResponseDto } from "@/types/techBlogApi";

interface ArticleCardProps {
	article: ArticleListItemResponseDto;
	showEditButton?: boolean;
	onEdit?: (article: ArticleListItemResponseDto) => void;
	currentUserId?: string;
}

export default function ArticleCard({
	article,
	showEditButton = false,
	onEdit,
	currentUserId,
}: ArticleCardProps) {
	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation(); // Impede que o clique no botão acione o clique do card
		onEdit?.(article);
	};

	// Verificar se o usuário atual é o autor do artigo
	const isAuthor = currentUserId && article.authorId === currentUserId;
	const shouldShowEditButton = showEditButton && isAuthor;

	return (
		<div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
			{/* Thumbnail */}
			<div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
				{article.coverImageUrl ? (
					<img
						src={article.coverImageUrl}
						alt={article.title}
						className="w-full h-full object-cover rounded-lg"
					/>
				) : (
					<div className="w-8 h-8 bg-gray-300 rounded"></div>
				)}
			</div>

			{/* Content */}
			<div className="flex-1 min-w-0">
				<h3 className="text-lg font-semibold text-foreground mb-1 truncate">
					{article.title}
				</h3>
				<p className="text-sm text-gray-600 mb-2 line-clamp-2">
					{article.summary || "Sem descrição disponível"}
				</p>
				<div className="flex items-center gap-2 flex-wrap">
					{article.tags.map((tag) => (
						<span
							key={tag.slug}
							className="px-2 py-1 text-xs font-medium bg-input-background text-foreground rounded-md"
						>
							{tag.name}
						</span>
					))}
				</div>
			</div>

			{/* Edit Button */}
			{shouldShowEditButton && (
				<button
					onClick={handleEdit}
					className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
					title="Editar artigo"
				>
					<PencilSimpleIcon size={16} weight="regular" />
				</button>
			)}
		</div>
	);
}
